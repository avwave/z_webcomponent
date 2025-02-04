import { faSignal, faSortAmountDown, faSortAmountUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { alpha, Checkbox, IconButton, lighten, LinearProgress, Tooltip, useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { UnfoldLess, UnfoldMore } from '@mui/icons-material';
import { kaReducer, Table } from "ka-table";
import { deselectAllFilteredRows, deselectRow, hideDetailsRow, selectAllFilteredRows, selectRow, showDetailsRow, updateData } from "ka-table/actionCreators";
import { DataType, SortDirection, SortingMode } from "ka-table/enums";
import { isEmpty } from 'lodash';
import React, { isValidElement, useCallback, useContext, useEffect, useState } from 'react';
import { useContextMenu } from 'react-contexify';
import Truncate from 'react-truncate';
import { actions as dataGridActions, DataGridContext } from '../DataGrid/DataGridContext';
import { PortalCell } from '../DataGrid/PortalCell';
import { useUrlState } from '../hooks/useUrlState';

import Datagrid2Toolbar from './Datagrid2Toolbar';
import { AuocompleteFilterRenderer, ChipTabsFilterRenderer, DateRangeFilterRenderer, OptionFilterRenderer, TextFilterRenderer } from './FilterRenderer';
import './styles.scss';

const CONTEXT_MENU_ACTIVATE = 'zwcl-DATAGRID-CONTEXT-ROW'

const TABLE_LOAD_OFFSET = 200;

const useStyles = makeStyles()((theme) => {
  return {
    datagrid: {
      height: '100%'
    },
    headerHover: {
      display: 'inline-flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: "center",
      fontWeight: 'bold',
      width: "100%"
    },
    headerHoverIcon: {
      fontSize: 12
    },
    colHighlight: {
      color: theme.palette.primary.main
    },
    checkboxHeader: {
      width: '15px'
      // marginLeft: 0-theme.spacing(.75),
      // paddingRight: theme.spacing(1)
    }
  }
});

const LOAD_MORE_DATA = "LOAD_MORE_DATA";
const ROW_SELECT = 'ROW_SELECT';

const PAGE_SIZE = 20

const tablePropsInit = {
  columns: [],
  rowKeyField: 'id',
  virtualScrolling: {
    enabled: true
  },
  columnReordering: true,
  columnResizing: true,
  singleAction: {
    // type: LOAD_MORE_DATA
  },
  sortingMode: SortingMode.SingleTripleState
}

const SelectionHeader = ({
  dispatch, areAllRowsSelected,
}) => {
  const { classes } = useStyles()
  return (
    <Checkbox
      className={classes.checkboxHeader}
      color="primary"
      checked={areAllRowsSelected}
      onChange={(event) => {
        if (event.target.checked) {
          dispatch(selectAllFilteredRows()); // also available: selectAllVisibleRows(), selectAllRows()
        } else {
          dispatch(deselectAllFilteredRows()); // also available: deselectAllVisibleRows(), deselectAllRows()
        }
      }}
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  );
};

const SelectionCell = ({
  rowKeyValue, dispatch, isSelectedRow, selectedRows, ...props
}) => {
  return (
    <Checkbox
      color="primary"
      checked={isSelectedRow}
      onChange={(event) => {
        if (event.target.checked) {
          dispatch(selectRow(rowKeyValue));
        } else {
          dispatch(deselectRow(rowKeyValue));
        }
      }}
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  );
};

const HeaderCell = ({ column, ...props }) => {
  const [onHover, setOnHover] = useState(false);
  const { classes, cx } = useStyles()
  return (
    <div className={cx(classes.headerHover, column.sortDirection && classes.colHighlight)} onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      {...props}>
      <span>{column.title}</span>
      {
        column?.sortable && <FontAwesomeIcon icon={faSignal} size="xs" transform={{ rotate: 90, flipY: true }} />
      }
      {column.sortDirection && (
        <FontAwesomeIcon icon={column.sortDirection === SortDirection.Ascend ? faSortAmountUp : faSortAmountDown} />
      )}
    </div>
  );
}

const RowExpanderButton = ({ dispatch, rowKeyValue, isDetailsRowShown }) => {
  return (
    <IconButton
      onClick={() => {
        dispatch(isDetailsRowShown ? hideDetailsRow(rowKeyValue) : showDetailsRow(rowKeyValue));
      }}
      size="large">
      {isDetailsRowShown ? <UnfoldLess /> : <UnfoldMore />}
    </IconButton>
  );
}
const useDynamicRowsOptions = ({ rowKeyField, ...rest }) => {
  const [renderedRowSizes] = useState({});
  let estimatedItemSize = 40;
  const addRowHeight = (rowData, height) => {
    if (height) {
      renderedRowSizes[rowData[rowKeyField]] = height;
    }
  };
  const totalHeight = Object.keys(renderedRowSizes).reduce(
    (sum, key) => sum + parseFloat(renderedRowSizes[key] || 0),
    0
  );
  estimatedItemSize =
    estimatedItemSize === 40 && Object.keys(renderedRowSizes).length
      ? Math.floor(totalHeight / Object.keys(renderedRowSizes).length)
      : estimatedItemSize;
  return {
    addRowHeight,
    itemHeight: rowData => {
      const itemHeight = renderedRowSizes[rowData[rowKeyField]] || estimatedItemSize
      return itemHeight
    }
  };
};

const DataGrid2 = React.forwardRef(({
  draggable,
  showSelector,
  filterable,
  style,
  containerStyle,
  gridProps,
  tableComponents,
  contextMenu,
  leftAccessory,
  rightAccessory,
  centerAccessory,
  onLoadMore = () => { },
  loadMoreOffset = TABLE_LOAD_OFFSET,
  totalCount,
  resetScroll,
  onContextMenu = () => { },
  hasSearchFilter = true,
  searchPlaceholder,
  hasDateRangeFilter = true,
  onSort = () => { },
  onClearFilters = () => { },
  defaultFilters = {},
  extendedRowAttributes = () => { },
  deferLoading = false,
  useUrlAsState = false,
  id = "grid",
  customColumnDisplay
}, ref) => {
  const { classes, cx } = useStyles()
  const theme = useTheme()

  const [tableProps, setTableProps] = useState(tablePropsInit);
  const [pageOffset, setPageOffset] = useState(0);

  const [filters, setFilters, filtersRef] = useUrlState({
    queryKey: `${id}-filters`,
    defaultValue: defaultFilters,
    disable: !useUrlAsState
  })

  const [dataGridState, dataGridDispatch] = useContext(DataGridContext);

  const [sortColumn, setSortColumn] = useUrlState({
    queryKey: `${id}-sortOn`,
    disable: !useUrlAsState
  });
  const [sortDirection, setSortDirection] = useUrlState({
    queryKey: `${id}-sortBy`,
    disable: !useUrlAsState
  })
  
  const [highlightedRow, setHighlightedRow] = useState();
  const { itemHeight, addRowHeight } = useDynamicRowsOptions(tableProps);

  const { show: showContextMenu } = useContextMenu({
    id: contextMenu?.menuId ?? "CONTEXT_MENU_ID",
  });

  function displayMenu(e, row) {
    showContextMenu(e, { props: { row } });
  }



  useEffect(() => {
    onSort(sortColumn, sortDirection);
  }, [sortColumn, sortDirection]);

  useEffect(() => {
    function getFilterRenderer(c) {
      switch (c.filter?.type) {
        case "text":
          return (args) => {
            return <TextFilterRenderer {...args} filter={c?.filter} />;
          };
        case "option":
          return (args) => (
            <OptionFilterRenderer {...args} filter={c?.filter} />
          );
        case "autocomplete":
          return (args) => (
            <AuocompleteFilterRenderer {...args} filter={c?.filter} />
          );
        case "dateRange":
          return (args) => (
            <DateRangeFilterRenderer {...args} filter={c?.filter} />
          );
        case "chiptabs":
          return (args) => (
            <ChipTabsFilterRenderer {...args} filter={c?.filter} />
          )
        default:
          return c?.filterRenderer
      }
    }
    const cols = dataGridState.columns.map(col => {
      const column = {
        ...col,
        key: col.key,
        title: col.name,
        dataType: DataType.Object,
        visible: !col.hidden,
        filterRenderer: getFilterRenderer(col),
        isResizable: col.resizable,
        style: { width: 200, minWidth: 200 },
        ...(col.key === 'select-row' ? { width: 50 } : {}),
        ...(col.key === sortColumn ? { sortDirection: sortDirection === 'ASC' ? 'ascend' : 'descend' } : {})
      }
      return column
    })

    setTableProps({
      ...tablePropsInit,
      columns: cols,
      data: dataGridState.rows,
      sort: ({ column }) => {
        const sort = column.sortDirection === 'ascend' ? 'ASC' : column.sortDirection === 'descend' ? 'DESC' : 'NONE'
        setSortColumn(column.key);
        if (sort !== 'NONE') {
          setSortDirection(sort);
        }

        return (a, b) => 0
      }
    })
  }, [dataGridState.columns]);

  const kaDispatch = useCallback(
    async action => {
      switch (action.type) {
        case LOAD_MORE_DATA:
          await onLoadMore({
            page_offset: pageOffset,
            page_size: PAGE_SIZE
          })
          break
        case ROW_SELECT:
          setHighlightedRow(action.rowKeyValue);
          break
        case CONTEXT_MENU_ACTIVATE:
          onContextMenu({ data: action?.row })
          break
        case 'SelectRow':
          const rset = new Set(gridProps?.selectedRows)
          rset.add(action.rowKeyValue)
          gridProps?.onSelectedRowsChange(Array.from(rset))
          break
        case 'DeselectRow':
          let delrows = new Set(gridProps?.selectedRows)
          delrows.delete(action.rowKeyValue)
          gridProps?.onSelectedRowsChange(Array.from(delrows))
          break
        case 'SelectAllFilteredRows':
          const rowes = dataGridState.rows.map(r => r.id)
          gridProps?.onSelectedRowsChange(rowes)
          break
        case 'DeselectAllFilteredRows':
          gridProps?.onSelectedRowsChange([])
          break
        default:
          break;
      }
      setTableProps(prevState => {
        let red = kaReducer(prevState, { ...prevState, ...action })
        red={...red, virtualScrolling:{
          ...red?.virtualScrolling,
          enabled: red?.data?.length > 10
        }}
        return red
      })
    },
    [onLoadMore, pageOffset, onContextMenu, gridProps, dataGridState.rows],
  );

  
  useEffect(() => {
    if (!isEmpty(dataGridState.rows)) {
      kaDispatch(updateData(dataGridState.rows))
    } else {
      kaDispatch(updateData([]))
    }

  }, [dataGridState.rows]);

  // useEffect(() => {
  //   dataGridState.loading ? kaDispatch(showLoading()) : kaDispatch(hideLoading())
  // }, [dataGridState.loading, kaDispatch]);

  const fetchRenderer = useCallback(
    (cellProps) => {
      cellProps = { ...cellProps, row: cellProps.rowData }
      const targetColumn = tableProps.columns.find(col => col.key === cellProps.column.key)
      if (cellProps.column.key === "select-row") {
        if (targetColumn?.selectable) {
          const selectable = targetColumn?.selectable(cellProps)
          return selectable?<SelectionCell {...cellProps} />:<></>
        } else {
          return <SelectionCell {...cellProps}/>
        }
      }

      
      const element = cellProps.row[cellProps.column.key];
      const isReactElem = isValidElement(element);
      const cellData = cellProps.row[cellProps.column.key]
      const tooltip =
        typeof cellData === "object"
          ? isReactElem
            ? element
            : JSON.stringify(element)
          : element;
      const cellRenderer = !!targetColumn?.cellRenderer ? (
        targetColumn?.cellRenderer(cellProps)
      ) : (
        isReactElem ? <span style={targetColumn.cellStyles}>{element}</span> :
          <div>
            <Truncate
            width={targetColumn?.width}
            lines={targetColumn?.truncateLines ?? 2} ellipsis={<span>(...)</span>}
            style={targetColumn.cellStyles}
          >
            {tooltip}
          </Truncate>
            </div>

      );
      const renderedTooltip =
        typeof targetColumn.tooltip === "function" ? targetColumn?.tooltip(cellProps) : tooltip;
      let finalizedCell = cellRenderer;
      if (targetColumn.noTooltip || isEmpty(renderedTooltip)) {
        finalizedCell = cellRenderer;
      } else {
        finalizedCell = (
          <Tooltip
            title={renderedTooltip}
            placement="bottom-start"
            className={classes.tooltip}
          >
            {cellRenderer}
          </Tooltip>
        );
      }
      const renderItem = targetColumn?.expandRenderer ? targetColumn?.expandRenderer(cellProps) : false
      return (renderItem) ? <PortalCell expandCell={targetColumn?.expandRenderer(cellProps)} renderedCell={finalizedCell} /> : finalizedCell;

    },
    [tableProps.columns],
  );

  useEffect(() => {
    dataGridDispatch({
      type: dataGridActions.FILTER_COLUMN,
      payload: {
        filterColumn: filters,
      },
    });
  }, [filters]);

  const [scrollYoffset, setScrollYoffset] = useState(0);
  return (
    <div className={cx('datagrid', classes.datagrid)} style={{ ...containerStyle }}>
      <Datagrid2Toolbar
        useUrlAsState={useUrlAsState}
        hasDateRangeFilter={hasDateRangeFilter}
        searchPlaceholder={searchPlaceholder}
        hasSearchFilter={hasSearchFilter}
        tableProps={tableProps}
        dispatch={kaDispatch}
        columns={tableProps.columns}
        showSelector={showSelector}
        filterable={filterable}
        onFilterChange={(f)=>{
          setFilters(f)
        }}
        rightAccessory={rightAccessory}
        leftAccessory={leftAccessory}
        centerAccessory={centerAccessory}
        totalCount={totalCount}
        loadedCount={dataGridState.rows.length}
        defaultFilters={defaultFilters}
        gridProps={gridProps}
        onClearFilters={() => onClearFilters()}
        gridId={id}
        customColumnDisplay={customColumnDisplay}
      />
      <div style={{ display: 'none' }}>{sortColumn}{sortDirection}</div>
      {dataGridState.loading ? <LinearProgress /> : <LinearProgress variant="determinate" value={0} />}
      <Table
        style={{ ...style }}
        {...tableProps}
        dispatch={kaDispatch}
        virtualScrolling={{
          ...tableProps.virtualScrolling,
          itemHeight
        }}
        childComponents={{
          dataRow: {
            elementAttributes: ({ rowData }) => {
              const attribs = extendedRowAttributes(rowData)
              return {
                ref: ref => addRowHeight(rowData, ref?.offsetHeight),
                onContextMenu: (e, extendedEvent) => {
                  if (contextMenu) {
                    displayMenu(e, rowData)
                    extendedEvent.dispatch({ type: CONTEXT_MENU_ACTIVATE, row: rowData, ...{ extendedEvent } })
                  }
                },
                onClick: (evt, extendedEvent) => {
                  const {
                    childProps: { rowKeyValue },
                    dispatch
                  } = extendedEvent
                  dispatch({ type: ROW_SELECT, rowKeyValue })
                },
                ...attribs
              }
            }
          },
          headCellContent: {
            content: props => <HeaderCell {...props} />
          },
          headCell: {
            content: (props) => {
              if (props.column.key === 'select-row' && !props.column?.options?.noHeader) {
                return (
                  <SelectionHeader {...props}
                  // areAllRowsSelected={kaPropsUtils.areAllFilteredRowsSelected(tableProps)}
                  // areAllRowsSelected={kaPropsUtils.areAllVisibleRowsSelected(tableProps)}
                  />
                );
              }
              if (!props.column?.sortable) {
                return <HeaderCell {...props} />
              }
            },
            elementAttributes: ({ column, ...cellProps }) => {
              return (['id', 'select-row'].includes(column.key) || column?.frozen) ? {
                style: {
                  ...column.style,
                  position: 'sticky',
                  padding: 0,
                  paddingLeft: 20,
                  left: 0,
                  zIndex: 11,
                  backgroundColor: theme.palette.grey[100],
                }
              } : {
                style: {
                  ...column.style,
                  backgroundColor: theme.palette.grey[100],
                }
              }
            }
          },
          cell: {
            elementAttributes: ({ column, ...props }) => {
              return (['id', 'select-row'].includes(column.key) || column?.frozen) ? {
                style: {
                  ...column.style,
                  position: 'sticky',
                  left: 0,
                  backgroundColor: (highlightedRow === props?.rowData?.id) ? lighten(theme.palette.primary.light, .75) : theme.palette.background.paper,
                }
              } : {
                style: {
                  ...column.style,
                  backgroundColor: (highlightedRow === props?.rowData?.id) ? alpha(theme.palette.primary.light, .25) : null,
                  overflow: 'hidden'
                }
              }
            }
          },
          cellText: {
            content: props => {
              const component = fetchRenderer(props)
              if (props?.column?.expanderControl) {
                return <RowExpanderButton {...props} />
              }
              return component
            }
          },
          tableWrapper: {
            elementAttributes: () => ({
              ref: ref,
              onScroll: (event, { baseFunc }) => {
                baseFunc(event);
                const element = event.currentTarget;
                setScrollYoffset(element.scrollLeft)
                if (element.scrollLeft !== scrollYoffset) {
                  return
                }
                if (
                  element.offsetHeight + element.scrollTop >=
                  element.scrollHeight - loadMoreOffset
                ) {
                  if (!deferLoading) {
                    kaDispatch({ type: LOAD_MORE_DATA });
                  } else {
                    if (!dataGridState.loading) {
                      kaDispatch({ type: LOAD_MORE_DATA });
                    }
                  }
                }
              },
            })
          },
          ...tableComponents
        }}
        {...gridProps}
      />
      {contextMenu?.contextItems() ?? <></>}
    </div>
  );
})

export { DataGrid2 };
