import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import React, { isValidElement, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useUrlState } from '../hooks/useUrlState';


import { Clear, Search } from '@mui/icons-material';
import { Box, Button, CircularProgress, IconButton, InputAdornment, LinearProgress, ThemeProvider, Toolbar, Tooltip, Typography, createTheme, debounce, styled, tooltipClasses, useTheme } from '@mui/material';
import { isEmpty } from 'lodash';
import TruncateMarkup from 'react-truncate-markup';
import { DataGridContext, actions as dataGridActions } from '../DataGrid/DataGridContext';
import { PortalCell } from '../DataGrid/PortalCell';
import { DataGridToolbar } from './DataGridToolbar';
import { tableTranslation } from './localization';
import { fuzzyDate, localizeCurrency, localizePercent } from '../utils/format';
import moment from 'moment';
import { useUpdateEffect } from 'usehooks-ts';
import { useStateRef } from '../hooks/useStateRef';
import useTableSettings from './useTableSettings';

const useStyles = makeStyles()(theme => ({
  rootContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    flex: 1
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    flex: 1
  },
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
    ...theme.typography.body2,
  },
}));


const VirtuosoDataGrid = ({
  persistSettings = false,
  alternateToolbarFilter = false,
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
  onLoadMore = async () => { },
  hideFooter = false,
  manualLoadMore = false,
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
  awaitUrlState = (filters) => { },
  id,
  customColumnDisplay,
  isRowExpandableCallback,
  density = "compact",
  replaceFilterWithComponent = false,
  loadMoreTriggerOffset = 500
}) => {
  const { classes } = useStyles()
  const theme = useTheme()
  const tableContainerRef = useRef(null)
  const [currentVariant, setCurrentVariant] = useState('current');
  const rowVirtualizerInstanceRef = useRef(null)

  const [globalFilter, setGlobalFilter] = useState('');

  const [filters, setFilters, filtersRef] = useUrlState({
    queryKey: `${id}-filters`,
    defaultValue: defaultFilters,
    disable: !useUrlAsState
  })

  const [dataGridState, dataGridDispatch] = useContext(DataGridContext);

  const [tableSettings, createTableSetting, updateTableSetting, readTableSetting, switchVariant, readVariant, writeVariant, listVariants] = useTableSettings(id, {}, persistSettings);

  const rerender = useReducer(() => ({}), {})[1];
  const [columnVisibility, setColumnVisibility, columnVisibilityRef] = useStateRef({});
  const [tableDensity, setDensity, densityRef] = useStateRef(density);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowSelection, setRowSelection] = useState({});
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [pinnedColumns, setPinnedColumns, pinnedColumnsRef] = useStateRef();

  const [sortState, setSortState] = useState([]);
  const [sortColumn, setSortColumn] = useUrlState({
    queryKey: `${id}-sortOn`,
    disable: !useUrlAsState
  });
  const [sortDirection, setSortDirection] = useUrlState({
    queryKey: `${id}-sortBy`,
    disable: !useUrlAsState
  })

  const writeSetting = useCallback(
    (settingKey, value, variantKey) => {
      let variantSettings = readVariant(variantKey)
      variantSettings[settingKey] = value
      writeVariant(variantKey, variantSettings)
      return null
    }, [readVariant, writeVariant]
  );


  useEffect(() => {
    dataGridDispatch({
      type: dataGridActions.FILTER_COLUMN,
      payload: {
        filterColumn: filters,
      },
    });
    awaitUrlState(filtersRef.current)
  }, [filters]);

  const [internalRowSelection, setInternalRowSelection] = useState({});
  const [externalLoaded, setExternalLoaded, exref] = useStateRef();
  useEffect(
    () => {
      if (!table) return
      const objrows = Object.fromEntries((gridProps?.selectedRows ?? [])?.map((v) => [v, true]))
      setExternalLoaded(true)
      setInternalRowSelection(objrows)

    }, [gridProps?.selectedRows]
  );

  useEffect(
    () => {
      if (exref?.current) return
      if (gridProps?.onSelectedRowsChange) {
        gridProps?.onSelectedRowsChange(Object.keys(internalRowSelection))
      }
    }, [internalRowSelection]
  );


  //per row selection enable
  const enableTableSelection = useMemo(
    () => {
      const selectableFilter = dataGridState?.columns?.filter(col => col?.selectable)
      const isSelectable = selectableFilter?.length > 0 || !!gridProps?.onSelectedRowsChange
      return isSelectable
    }, [dataGridState?.columns, gridProps?.onSelectedRowsChange]
  );
  const enableRowSelection = useCallback(
    (row) => {
      const selectableFilter = dataGridState?.columns?.filter(col => col?.selectable)
      const firstFilter = selectableFilter?.[0]
      const isFilterable = firstFilter?.selectable({ row })
      return isFilterable
    }, [dataGridState?.columns]
  );

  const data = useMemo(
    () => {
      const rows = dataGridState?.rows
      return rows
    }, [dataGridState?.rows]
  );

  const columns = useMemo(
    () => {
      const cols = dataGridState?.columns
        ?.filter(col => !col.expanderControl)
        ?.map((col) => {
          return {
            header: col.name,
            accessorKey: col.key,
            enableSorting: !!col.sortable,
            enablePinning: !col.hidden,
            grow: !!col.grow,
            size: col?.width,
            enableResizing: !!col.resizable,

            Header: ({ column, ...rest }) => {
              if (col?.columnHeaderRenderer) {
                return <div draggable className={classes.truncate}>{col?.columnHeaderRenderer()}</div>
              } else {
                return <div draggable className={classes.truncate}>{col?.name}</div>
              }
            },
            Cell: ({ row, column, renderedCellValue, cell, ...rest }) => {
              let align = col?.align ?? 'left'
              let content = renderedCellValue
              switch (col?.dataType) {
                case 'number':
                case 'float':
                  align = 'right'
                  break
                case 'currency':
                  align = 'right'
                  content = localizeCurrency(cell?.getValue(), col?.currencyCode ?? 'PHP')
                  break;
                case 'percent':
                  align = 'right'
                  content = localizePercent(cell?.getValue())
                  break;
                case 'date':
                  if (cell?.getValue() === null || cell?.getValue() === undefined) {
                    return '-'
                  }
                  if (col.dateOptions?.relative) {
                    content = fuzzyDate(cell?.getValue())
                  } else {
                    content = moment(cell?.getValue()).format(col.dateOptions?.format ?? 'LL LTS')
                  }
                  break;
                default:
                  break;
              }
              let toolTipCell = renderedCellValue
              let finalizedCell = <></>
              if (col?.cellRenderer) {
                finalizedCell = (
                  <div style={{ width: '100%' }}>
                    <Typography
                      variant='body2'
                      noWrap
                      textAlign={align}
                    >
                      {col?.cellRenderer({ row: row?.original, renderedCellValue })}
                    </Typography>
                  </div>
                )
                toolTipCell = col?.cellRenderer({ row: row?.original, renderedCellValue })
              } else {
                finalizedCell = <div style={{ width: '100%' }}>
                  <Typography
                    variant='body2'
                    noWrap
                    textAlign={align}
                    style={col?.cellStyles}>
                    {content}
                  </Typography>
                </div>
                // }
              }
              const expanderContent = col?.expandRenderer && col?.expandRenderer({ row: row?.original })
              if (expanderContent) {
                return <PortalCell expandCell={expanderContent} renderedCell={finalizedCell} />
              }
              const renderedTooltip = typeof col?.tooltip === "function" ? col?.tooltip({ row: row?.original }) : toolTipCell;

              if (!(col?.noTooltip || isEmpty(renderedTooltip))) {
                return <LightTooltip
                  enterDelay={500}
                  leaveDelay={200}
                  title={renderedTooltip}
                  placement="bottom-start"
                  className={classes.tooltip}
                >
                  {finalizedCell}
                </LightTooltip>
              }
              return finalizedCell
            },
            ...col?.columnProps
          }
        })
      return cols
    }, [classes.tooltip, classes.truncate, dataGridState?.columns]
  );


  const [columnSizes, setColumnSizes, columnSizesRef] = useStateRef(null);


  //scroll events for loadmore

  const doLoadMore = useCallback(
    async () => {
      setLoadMoreLoading(true)
      await onLoadMore()
      setShowManualLoadMore(false)
      setLoadMoreLoading(false)
    },
    [onLoadMore],
  );

  const [showManualLoadMore, setShowManualLoadMore] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const fetchMoreOnBottomReached = useCallback(
    async (containerRefElement, manual) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

        setLastScrollTop(scrollTop);
        if (scrollTop < lastScrollTop) {
          return;
        }

        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
        if (!!manual) {
          setShowManualLoadMore(true)
        }
        if (
          scrollHeight - scrollTop - clientHeight < loadMoreTriggerOffset
          && !dataGridState?.loading
          && totalCount > dataGridState?.rows?.length
        ) {
          if (!!manual) {
            setShowManualLoadMore(true)
          } else {
            doLoadMore()
          }
        }
      }
    },
    [dataGridState?.loading, dataGridState?.rows?.length, doLoadMore, totalCount, lastScrollTop, loadMoreTriggerOffset],
  );


  //render manual bottom toolbar if loadmore is manual (for erroneous loadmore
  const renderBottomToolbar = useMemo(
    () => {
      if (hideFooter) return <></>
      if (showManualLoadMore && manualLoadMore) {
        return <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
          <Button
            variant={'text'}
            onClick={() => {
              doLoadMore()
            }}
            startIcon={loadMoreLoading && <CircularProgress size={16} />}
          >Load more</Button>
        </Box>
      }
      return <></>
    },
    [doLoadMore, hideFooter, loadMoreLoading, manualLoadMore, showManualLoadMore],
  );
  //check on mount if needs to load more to fill the table
  useEffect(
    () => {
      fetchMoreOnBottomReached(tableContainerRef.current, manualLoadMore)
    }, [manualLoadMore]
  );

  //onfilter and onsort change
  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
      setLastScrollTop(0);
    } catch (error) {
      console.error(error);
    }
  }, [sortColumn, sortDirection, filters]);


  const defaultCols = useMemo(
    () => {
      const colmap = []
      if (enableTableSelection) {
        colmap.push('mrt-row-select')
      }
      if (tableComponents?.detailsRow?.content) {
        colmap.push('mrt-row-expand')
      }
      return colmap

    }, [enableTableSelection, tableComponents?.detailsRow?.content]
  );

  const [columnOrder, setColumnOrder, columnOrderRef] = useStateRef([]);

  const defaultColumnOrder = useMemo(
    () => {
      if (dataGridState?.columns?.length <= 0) {
        return null
      }
      const setting = readVariant('current')
      if (setting?.columnOrder?.length > 0) {
        // has default column order
        setColumnOrder([...defaultCols, ...setting?.columnOrder])
        return [...defaultCols, ...setting?.columnOrder]
      } else {
        const cols = dataGridState?.columns?.map((col) => col.key)
        setColumnOrder([...defaultCols, ...cols])
        if (!readVariant('default').columnOrder) {
          writeSetting('columnOrder', cols, 'default')
        }
        return [...defaultCols, ...cols]
      }

    }, [dataGridState?.columns, defaultCols]
  );

  const defaultPinnedColumns = useMemo(
    () => {
      const cols = dataGridState?.columns?.filter(col => col.frozen)?.map(col => col.key)

      const pinopts = {
        left: [...defaultCols, ...cols],
      }

      const settings = readVariant('current')
      if (settings?.columnPinning) {
        setPinnedColumns(settings?.columnPinning)
      } else {
        if (!readVariant('default').columnPinning) {
          writeSetting('columnPinning', pinopts, 'default')
        }
        setPinnedColumns(pinopts)
      }


    }, [dataGridState?.columns, defaultCols]
  );

  const defaultColumnSizes = useMemo(
    () => {
      if (dataGridState?.columns?.length <= 0) {
        return null
      }
      const settings = readVariant('current')
      if (settings?.columnSizing) {
        setColumnSizes(settings?.columnSizing)
        return settings?.columnSizing
      } else {
        const objMap = dataGridState?.columns?.map(col => [col.key, col.width])
        const obj = Object.fromEntries(objMap)
        setColumnSizes(obj)
        if (!readVariant('default').columnSizing) {
          writeSetting('columnSizing', obj, 'default')
        }
        return obj
      }
    }, [dataGridState?.columns]
  );

  const defaultHideColumns = useMemo(
    () => {
      if (dataGridState?.columns?.length <= 0) {
        return null
      }
      const settings = readVariant('current')
      if (settings?.columnVisibility) {
        setColumnVisibility(settings?.columnVisibility)
        return settings?.columnVisibility
      } else {
        const objMap = dataGridState?.columns?.filter(col => col.hidden)?.map(col => [col.key, false])
        const obj = Object.fromEntries(objMap)
        setColumnVisibility(obj)
        if (!readVariant('default').columnVisibility) {
          writeSetting('columnVisibility', obj, 'default')
        }
        return obj
      }
    }, [dataGridState?.columns]
  );

  useUpdateEffect(
    () => {
      if (sortState?.[0]?.id) {
        onSort(sortState?.[0]?.id, sortState?.[0]?.desc ? 'DESC' : 'ASC')
      }
    }, [sortState]
  );

  const debounceSearch = useCallback(
    debounce(f => {
      setFilters({ ...filters, search: f })
    }, 500),
    [],
  );

  const renderAccessories = useMemo(
    () => {
      const accessoryBar = (
        <Toolbar variant="dense">
          <Box>
            {leftAccessory ? leftAccessory() : <></>}
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            {centerAccessory ? centerAccessory() : <></>}
          </Box>
          <Box >
            {rightAccessory ? rightAccessory() : <></>}
          </Box>
        </Toolbar>

      )
      if (leftAccessory || centerAccessory || rightAccessory) return accessoryBar;
      return <></>

    }, [centerAccessory, classes.toolbarLeft, classes.toolbarRight, leftAccessory, rightAccessory]
  );

  const renderDetailPanel = useCallback(
    ({ row }) => {
      const DetailRowComponent = tableComponents?.detailsRow?.content
      if (DetailRowComponent) {
        return <DetailRowComponent rowData={row?.original} />
      }
      return null

    },
    [tableComponents?.detailsRow?.content],
  );


  const reorderColumn = useCallback(
    (draggedColumn, targetColumn, columnOrder) => {
      if (draggedColumn.getCanPin()) {
        draggedColumn.pin(targetColumn.getIsPinned());
      }
      const newColumnOrder = [...columnOrder];
      newColumnOrder.splice(
        newColumnOrder.indexOf(targetColumn.id),
        0,
        newColumnOrder.splice(newColumnOrder.indexOf(draggedColumn.id), 1)[0],
      );
      return newColumnOrder;
    },
    [],
  );

  const table = useMaterialReactTable({
    enableFilterMatchHighlighting: true,
    localization: tableTranslation,
    className: classes.table,
    columnResizeMode: 'onChange',
    manualFiltering: true,
    manualSorting: true,
    enableDensityToggle: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    enablePagination: false,
    enableColumnVirtualization: true,
    enableRowVirtualization: true,
    enableStickyHeader: false,
    enableRowSelection: enableTableSelection ? row => enableRowSelection(row) : false,
    enableMultiRowSelection: true,
    enableHiding: true,
    enableGrouping: false,
    enableColumnDragging: false,
    enableColumnPinning: true,
    enableSorting: true,
    enableSortingRemoval: true,
    enableColumnFilters: false,
    enableMultiSort: false,
    data: data,
    columns: columns,
    onRowSelectionChange: rows => {
      setExternalLoaded(false)
      setInternalRowSelection(rows)
    },
    muiTableContainerProps: {
      ref: tableContainerRef,
      sx: {
        height: '100%',
        maxHeight: '100vh',

      },
      onScroll: (e) => {
        fetchMoreOnBottomReached(e.target, manualLoadMore)
      },
      ...gridProps?.tableContainerProps
    },
    layoutMode: 'grid',
    muiTableHeadCellProps: ({ column, table }) => {
      return {
        onDragStart: e => {
          table?.setDraggingColumn(column)
        },
        onDragEnter: e => {
          table.setHoveredColumn(column);
        },
        onDragEnd: e => {
          const { hoveredColumn, columnOrder, draggingColumn } = table.getState()
          if (hoveredColumn?.id === 'drop-zone') {
            column.toggleGrouping();
          } else if (
            hoveredColumn &&
            hoveredColumn?.id !== draggingColumn?.id
          ) {
            table.setColumnOrder(
              reorderColumn(column, hoveredColumn, columnOrder),
            );
          }
          table.setDraggingColumn(null);
          table.setHoveredColumn(null);

        },

      }
    },
    muiTablePaperProps: {
      sx: {
        height: 'calc(100% - 96px)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }
    },
    state: {
      showProgressBars: dataGridState.loading,
      rowSelection: internalRowSelection,
      sorting: sortState,
      columnVisibility,
      pagination,
      showColumnFilters,
      columnPinning: pinnedColumns,
      density: tableDensity,
      globalFilter,
      columnOrder,
      columnSizing: columnSizes,
      ...gridProps?.gridState
    },
    onSortingChange: setSortState,
    rowVirtualizerInstanceRef: rowVirtualizerInstanceRef,
    rowVirtualizerProps: { overscan: 4 },
    initialState: {
      columnOrder: defaultColumnOrder,
      columnVisibility: defaultHideColumns,
      columnPinning: defaultPinnedColumns,
      showGlobalFilter: hasSearchFilter && filterable,
      columnSizing: defaultColumnSizes,
    },
    enableGlobalFilter: true,
    onGlobalFilterChange: (f) => {
      setGlobalFilter(f)
      debounceSearch(f)
    },
    muiSearchTextFieldProps: (props) => {
      return {
        placeholder: searchPlaceholder ?? 'Search',
        variant: 'outlined',
        size: 'small',
        autoComplete: 'default-search-field',
        inputProps: {
          autoComplete: 'default-search-field',
          type: 'search',
        },
        InputProps: {
          autoComplete: 'default-search-field',
          startAdornment:
            <InputAdornment position="start">
              <Search />
            </InputAdornment>,
          endAdornment: <InputAdornment position="end">
            {globalFilter && (
              <IconButton
                aria-label="clear search"
                onClick={() => {
                  setGlobalFilter('')
                  debounceSearch('')
                }}
              >
                <Clear />
              </IconButton>
            )}
          </InputAdornment>
        }
      }
    },
    //row expansion
    enableExpanding: !!tableComponents?.detailsRow?.content,
    enableExpandAll: false,
    getRowCanExpand: row => isRowExpandableCallback ? isRowExpandableCallback(row?.original) : true,
    muiExpandButtonProps: ({ row }) => {
      const hidden = isRowExpandableCallback ? isRowExpandableCallback(row?.original) : true
      return {
        sx: {
          visibility: hidden ? 'visible' : 'hidden'
        }
      }
    },
    displayColumnDefOptions: {
      'mrt-row-select': {
        size: 50, //adjust the size of the row select column
        grow: false, //new in v2.8 (default is false for this column)
      },
      'mrt-row-expand': {
        size: 50,
        grow: false, //new in v2.8 (allow this column to grow to fill in remaining space)
      },
    },
    renderDetailPanel: tableComponents?.detailsRow?.content ? ({ row }) => {
      return renderDetailPanel({ row })
    } : false,

    enableTopToolbar: false,
    onColumnSizingChange: (updater) => {
      setColumnSizes((prev) =>
        updater instanceof Function ? updater(prev) : updater
      );
      writeSetting('columnSizing', columnSizesRef.current, 'current')
      queueMicrotask(rerender); //hack to rerender after state update
    },
    onColumnOrderChange: (updater) => {
      setColumnOrder((prev) =>
        updater instanceof Function ? updater(prev) : updater,
      );
      writeSetting('columnOrder', columnOrderRef.current, 'current')
      queueMicrotask(rerender); //hack to rerender after state update
    },
    onColumnPinningChange: (updater) => {
      setPinnedColumns((prev) =>
        updater instanceof Function ? updater(prev) : updater,
      );
      writeSetting('columnPinning', pinnedColumnsRef.current, 'current')
      queueMicrotask(rerender); //hack to rerender after state update
    },
    onColumnVisibilityChange: (updater) => {
      setColumnVisibility((prev) =>
        updater instanceof Function ? updater(prev) : updater,
      );
      writeSetting('columnVisibility', columnVisibilityRef.current, 'current')
      queueMicrotask(rerender); //hack to rerender after state update
    },
    onDensityChange: (updater) => {
      setDensity((prev) =>
        updater instanceof Function ? updater(prev) : updater,
      );
      writeSetting('density', densityRef.current, 'current')
      queueMicrotask(rerender); //hack to rerender after state update
    },
    onPaginationChange: (updater) => {
      setPagination((prev) =>
        updater instanceof Function ? updater(prev) : updater,
      );
      queueMicrotask(rerender); //hack to rerender after state update
    },
    onShowColumnFiltersChange: (updater) => {
      setShowColumnFilters((prev) =>
        updater instanceof Function ? updater(prev) : updater,
      );
      queueMicrotask(rerender); //hack to rerender after state update
    },
    getRowId: (orow) => orow?.id,
    renderEmptyRowsFallback: () => {
      if (gridProps?.emptyRowsRenderer) {
        return gridProps?.emptyRowsRenderer()
      }
    }
    ,
    renderBottomToolbar: () => {
      return renderBottomToolbar
    },
    muiTableBodyRowProps: ({ row }) => {
      const attribs = extendedRowAttributes(row?.original)
      return {
        ...attribs,
        title: null
      }
    },
    ...gridProps

  });

  //hack: tableref doesnt update on first set, wait for ref to be available, then do hacky rerender
  const [oneShot, setOneShot] = useState(false);
  useEffect(
    () => {
      const r = table
      if (oneShot && r) return;
      setOneShot(true)
      queueMicrotask(rerender);
    }, [table]
  );


  const doResetSettings = useCallback(
    async () => {
      const settings = readVariant('default')
      writeVariant('current', settings)
      
      const orderedcols = [...defaultCols, ...dataGridState.columns.map((col) => col.key)]
      setColumnOrder(orderedcols)

      
      const pinnedcols = {
        left: [...defaultCols, ...dataGridState?.columns?.filter(col => col.frozen)?.map(col => col.key)],
      }
      setPinnedColumns(pinnedcols)

      const sizedCols = Object.fromEntries(dataGridState?.columns?.map(col => [col.key, col.width]))
      setColumnSizes(sizedCols)

      const hiddenCols = Object.fromEntries(dataGridState?.columns?.filter(col => col.hidden)?.map(col => [col.key, false]))
      setColumnVisibility(hiddenCols)

      const density = 'compact'
      setDensity(density)

      queueMicrotask(rerender)
    }, [dataGridState.columns, defaultCols, readVariant, rerender, setColumnOrder, setColumnSizes, setColumnVisibility, setDensity, setPinnedColumns, writeVariant]
  );


  if (defaultHideColumns === null && defaultColumnOrder === null)
    return <LinearProgress />

  return (
    <div className={classes.rootContainer}>
      {renderAccessories}
      <DataGridToolbar
        onResetSettings={()=>{
          doResetSettings()
        }}
        alternateToolbarFilter={alternateToolbarFilter}
        tableInstanceRef={table}
        useUrlAsState={useUrlAsState}
        hasDateRangeFilter={hasDateRangeFilter}
        searchPlaceholder={searchPlaceholder}
        hasSearchFilter={hasSearchFilter}
        columns={dataGridState?.columns}
        showSelector={showSelector}
        filterable={filterable}
        onFilterChange={(f) => {
          setFilters({ ...f })
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
        replaceFilterWithComponent={replaceFilterWithComponent}
      />
      <ThemeProvider theme={(theme) => {
        return createTheme({
          ...theme,
          components: {
            ...theme?.components,
            MuiTableSortLabel: {
              styleOverrides: {
                icon: {
                  opacity: .20,
                },
              }
            }
          }
        })
      }}
      >
        <MaterialReactTable
          table={table}
        />
      </ThemeProvider>
    </div>
  )
}

export { VirtuosoDataGrid };

