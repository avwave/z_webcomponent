import './styles.scss'
import { kaReducer, Table } from "ka-table";
import { ActionType, DataType, SortingMode, SortDirection } from "ka-table/enums";
import { Button, Checkbox, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { deselectRow, selectAllFilteredRows, deselectAllFilteredRows, updateData, selectRowsRange, selectRow } from "ka-table/actionCreators";
import { actions as dataGridActions, DataGridContext } from '../DataGrid/DataGridContext';
import Datagrid2Toolbar from './Datagrid2Toolbar';
import { OptionFilterRenderer, TextFilterRenderer } from '../DataGrid/FilterRenderer';

const useStyles = makeStyles((theme) => {
  return {}
})

const LOAD_MORE_DATA = "LOAD_MORE_DATA";

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
    type: LOAD_MORE_DATA
  },
  sortingMode: SortingMode.SingleTripleState
}

const SelectionHeader = ({
  dispatch, areAllRowsSelected,
}) => {
  return (
    <Checkbox
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
  rowKeyValue, dispatch, isSelectedRow, selectedRows
}) => {
  return (
    <Checkbox
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

const useDynamicRowsOptions = ({ rowKeyField }) => {
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
    itemHeight: rowData =>
      renderedRowSizes[rowData[rowKeyField]] || estimatedItemSize
  };
};

const DataGrid2 = ({
  draggable,
  showSelector,
  filterable,
  style,
  containerStyle,
  gridProps,
  contextMenu,
  leftAccessory,
  rightAccessory,
  centerAccessory,
  onLoadMore = () => { },
  totalCount,
  resetScroll,
  onSort = () => { },
}) => {
  const classes = useStyles()

  const [tableProps, setTableProps] = useState(tablePropsInit);
  const [pageOffset, setPageOffset] = useState(0);
  const [filters, setFilters] = useState({});
  const [dataGridState, dataGridDispatch] = useContext(DataGridContext);

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());

  const { itemHeight, addRowHeight } = useDynamicRowsOptions(tableProps);

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
        style:{width: 100, minWidth: 100},
        ...col.key==='select-row'?{width: 50}:{},
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
        setSortDirection(sort);
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
        case 'SelectRow':
          setSelectedRows(new Set(selectedRows.add(action.rowKeyValue)))
          break
        case 'DeselectRow':
          const delrows = selectedRows.delete(action.rowKeyValue)
          setSelectedRows(new Set(selectedRows))
          break
        case 'SelectAllFilteredRows':
          const rowes = dataGridState.rows.map(r => r.id)
          setSelectedRows(new Set(rowes))
          break
        case 'DeselectAllFilteredRows':
          setSelectedRows(new Set())
          break
        default:
          break;
      }
      setTableProps(prevState => {
        const red = kaReducer(prevState, { ...prevState, ...action })
        return red
      })
    },
    [onLoadMore, pageOffset, dataGridState.rows],
  );

  useEffect(() => {
    gridProps?.onSelectedRowsChange && gridProps?.onSelectedRowsChange(Array.from(selectedRows))
  }, [selectedRows]);


  useEffect(() => {
    kaDispatch(updateData([...dataGridState.rows]))
  }, [dataGridState.rows, kaDispatch]);

  // useEffect(() => {
  //   dataGridState.loading ? kaDispatch(showLoading()) : kaDispatch(hideLoading())
  // }, [dataGridState.loading, kaDispatch]);

  const fetchRenderer = useCallback(
    (cellProps) => {
      if (cellProps.column.key === "select-row") {
        return <SelectionCell {...cellProps} />
      }
      const customCellRenderer = tableProps.columns.find(col => col.key === cellProps.column.key)?.cellRenderer
      return customCellRenderer ? customCellRenderer({ ...cellProps, row: cellProps.rowData }) : <Typography variant="body1">{cellProps.value}</Typography>
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
  }, [dataGridDispatch, filters]);


  return (
    <>
      <Datagrid2Toolbar
        tableProps={tableProps}
        dispatch={kaDispatch}
        columns={tableProps.columns}
        showSelector={showSelector}
        filterable={filterable}
        onFilterChange={setFilters}
        rightAccessory={rightAccessory}
        leftAccessory={leftAccessory}
        centerAccessory={centerAccessory}
        totalCount={totalCount}
        loadedCount={dataGridState.rows.length}
      />
      <div style={{ display: 'none' }}>{sortColumn}{sortDirection}</div>
      <Table
        {...tableProps}
        dispatch={kaDispatch}
        virtualScrolling={{
          ...tableProps.virtualScrolling,
          itemHeight
        }}
        childComponents={{
          dataRow: {
            elementAttributes: ({ rowData }) => ({
              ref: ref => addRowHeight(rowData, ref?.offsetHeight)
            })
          },
          headCell: {
            content: (props) => {
              if (props.column.key === 'select-row') {
                return (
                  <SelectionHeader {...props}
                  // areAllRowsSelected={kaPropsUtils.areAllFilteredRowsSelected(tableProps)}
                  // areAllRowsSelected={kaPropsUtils.areAllVisibleRowsSelected(tableProps)}
                  />
                );
              }
            },
            elementAttributes: ({ column }) => {
              return ['id', 'select-row'].includes(column.key) && {
                style: {
                  ...column.style,
                  position: 'sticky',
                  left: 0,
                  zIndex: 11,
                }
              }
            }
          },
          cell: {
            elementAttributes: ({ column }) => {
              return ['id', 'select-row'].includes(column.key) ? {
                style: {
                  ...column.style,
                  position: 'sticky',
                  left: 0,
                  backgroundColor: "#fff",
                  overflow: 'hidden'
                }
              } : {
                style: {
                  ...column.style,
                  backgroundColor: "#fff",
                  overflow: 'hidden'
                }
              }
            }
          },
          cellText: {
            content: props => {
              const component = fetchRenderer(props)
              return component
            }
          },
          tableWrapper: {
            elementAttributes: () => ({
              onScroll: (event, { baseFunc }) => {
                baseFunc(event);
                const element = event.currentTarget;
                if (
                  element.offsetHeight + element.scrollTop >=
                  element.scrollHeight
                ) {
                  kaDispatch({ type: LOAD_MORE_DATA });
                }
              },
            })
          }
        }}
      />
    </>
  );
}

export { DataGrid2 }