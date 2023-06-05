import MaterialReactTable from 'material-react-table';
import React, { isValidElement, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useUrlState } from '../hooks/useUrlState';


import { Box, Button, CircularProgress, LinearProgress, Toolbar, Tooltip, debounce } from '@mui/material';
import Truncate from 'react-truncate';
import { DataGridContext, actions as dataGridActions } from '../DataGrid/DataGridContext';
import { PortalCell } from '../DataGrid/PortalCell';
import { DataGridToolbar } from './DataGridToolbar';
import ReactJson from 'react-json-view';
import { useStateRef } from '../hooks/useStateRef';
import {isEmpty} from 'lodash';
const useStyles = makeStyles()(theme => ({
  rootContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    flex:1
  },
  table:{
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    flex: 1
  }
}));
const VirtuosoDataGrid = ({
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
  id = "grid",
  customColumnDisplay
}) => {
  const { classes } = useStyles()

  const tableContainerRef = useRef(null)
  const tableInstanceRef = useRef(null)
  const rowVirtualizerInstanceRef = useRef(null)

  const [filters, setFilters, filtersRef] = useUrlState({
    queryKey: `${id}-filters`,
    defaultValue: defaultFilters,
    disable: !useUrlAsState
  })

  const [dataGridState, dataGridDispatch] = useContext(DataGridContext);

  const rerender = useReducer(() => ({}), {})[1];
  const [columnVisibility, setColumnVisibility] = useState({});
  const [density, setDensity] = useState('comfortable');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowSelection, setRowSelection] = useState({});
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [pinnedColumns, setPinnedColumns] = useState();

  const [sortState, setSortState] = useState([]);
  const [sortColumn, setSortColumn] = useUrlState({
    queryKey: `${id}-sortOn`,
    disable: !useUrlAsState
  });
  const [sortDirection, setSortDirection] = useUrlState({
    queryKey: `${id}-sortBy`,
    disable: !useUrlAsState
  })

  useEffect(() => {
    dataGridDispatch({
      type: dataGridActions.FILTER_COLUMN,
      payload: {
        filterColumn: filters,
      },
    });
  }, [filters]);

  const [selectedRows, setSelectedRows] = useState({});

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
            // enableHiding: !col?.hidden,
            size: col?.width,
            minSize: col?.minWidth,
            Header: ({ column, ...rest }) => {
              if (col?.columnHeaderRenderer) {
                return <div>{col?.columnHeaderRenderer()}</div>
              } else {
                return <div>{col?.name}</div>
              }
            },
            Cell: ({ row, column, renderedCellValue, ...rest }) => {
      
              let finalizedCell = <></>
              if (col?.cellRenderer) {
                finalizedCell = <div>{col?.cellRenderer({ row: row?.original })}</div>
              } else {
                const v = rest?.cell?.renderValue()
                if (isValidElement(renderedCellValue) || col?.key === 'select-row') {
                  finalizedCell = <div>{renderedCellValue}</div>
                } else {
                  finalizedCell = <div>
                    <Truncate
                      width={column?.getSize()}
                      lines={col?.truncateLines ?? 2} ellipsis={<span>(...)</span>}
                      style={col.cellStyles}
                    >
                      {String(renderedCellValue)}
                    </Truncate>
                  </div>
                }
              }
              const expanderContent = col?.expandRenderer && col?.expandRenderer({ row: row?.original })
              if (expanderContent) {
                return <PortalCell expandCell={expanderContent} renderedCell={finalizedCell} />
              }
              const renderedTooltip = typeof col?.tooltip === "function" ? col?.tooltip({row:row?.original}) : renderedCellValue;

              if (!(col?.noTooltip || isEmpty(renderedTooltip))) {
                return <Tooltip
                  title={renderedTooltip}
                  placement="bottom-start"
                  className={classes.tooltip}
                >
                  {finalizedCell}
                </Tooltip>
              }
              return finalizedCell
            }
          }
        })
      return cols
    }, [dataGridState?.columns]
  );

  //scroll events for loadmore

  const doLoadMore = useCallback(
    async () => {
      if (dataGridState?.loading) {
        if (isEmpty(dataGridState?.rows)) {
          console.log('grid currently loading')
          return
        }
      }
      setLoadMoreLoading(true)
      await onLoadMore()
      setShowManualLoadMore(false)
      setLoadMoreLoading(false)
    },
    [onLoadMore, dataGridState?.loading],
  );

  const [showManualLoadMore, setShowManualLoadMore] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const fetchMoreOnBottomReached = useCallback(
    async (containerRefElement, manual) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
        if (!!manual) {
          setShowManualLoadMore(true)
        }
        if (
          scrollHeight - scrollTop - clientHeight < 200
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
    [dataGridState?.loading, dataGridState?.rows?.length, doLoadMore, totalCount],
  );


  //render manual bottom toolbar if loadmore is manual (for erroneous loadmore
  const renderBottomToolbar = useMemo(
    () => {
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
    },
    [doLoadMore, loadMoreLoading, manualLoadMore, showManualLoadMore],
  );
  //check on mount if needs to load more to fill the table
  useEffect(
    () => {
      fetchMoreOnBottomReached(tableContainerRef.current, manualLoadMore)
    }, [fetchMoreOnBottomReached, manualLoadMore]
  );

  //onfilter and onsort change
  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
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

  const defaultColumnOrder = useMemo(
    () => {
      if (dataGridState?.columns?.length <= 0) {
        return null
      }
      const cols = dataGridState?.columns?.map((col) => col.key)

      return [...defaultCols, ...cols]
    }, [dataGridState?.columns, defaultCols]
  );

  const defaultPinnedColumns = useMemo(
    () => {
      const cols = dataGridState?.columns?.filter(col => col.frozen)?.map(col => col.key)
      const pinopts = {
        left: [...defaultCols, ...cols],
      }
      setPinnedColumns(pinopts)
    }, [dataGridState?.columns]
  );
  const defaultHideColumns = useMemo(
    () => {
      if (dataGridState?.columns?.length <= 0) {
        return null
      }
      const objMap = dataGridState?.columns?.filter(col => col.hidden)?.map(col => [col.key, false])
      const obj = Object.fromEntries(objMap)
      setColumnVisibility(obj)
      return obj
    }, [dataGridState?.columns]
  );

  useEffect(
    () => {
      const mapToArray = Object.keys(selectedRows).map((key) => key)
      const tsrows = tableInstanceRef?.current?.getState()?.rowSelection;

      gridProps?.onSelectedRowsChange?.(mapToArray)
    }, [selectedRows]
  );

  useEffect(
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

  //hack: tableref doesnt update on first set, wait for ref to be available, then do hacky rerender
  const [oneShot, setOneShot] = useState(false);
  useEffect(
    () => {
      const r = tableInstanceRef?.current
      if (oneShot && r) return;
      setOneShot(true)
      queueMicrotask(rerender);
    }, [tableInstanceRef?.current]
  );


  if (defaultHideColumns === null && defaultColumnOrder === null)
    return <LinearProgress />

  return (
    <div className={classes.rootContainer}>
      {renderAccessories}
      <DataGridToolbar
        tableInstanceRef={tableInstanceRef}
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
      />
      <MaterialReactTable
        className={classes.table}
        tableInstanceRef={tableInstanceRef}
        columnResizeMode='onChange'
        manualFiltering
        manualSorting
        memoMode="cells"
        enableDensityToggle={false}
        enableColumnOrdering
        enableColumnResizing
        enableExpandAll={false}
        enablePagination={false}
        enableRowVirtualization
        // enableColumnVirtualization
        enableRowSelection={enableTableSelection ? row => enableRowSelection(row) : false}
        enableHiding
        enableGrouping={false}
        // enableColumnDragging
        enablePinning
        enableSorting
        enableSortingRemoval
        enableColumnFilters={false}
        enableMultiSort={false}
        data={data}
        columns={columns}
        onRowSelectionChange={(sRows) => {
          setSelectedRows(sRows)
        }}
        muiTableContainerProps={{
          ref: tableContainerRef,
          sx: {
            height: '100%',
            flex:1
          },
          onScroll: (e) => {
            fetchMoreOnBottomReached(e.target, manualLoadMore)
          },
          ...gridProps?.tableContainerProps
        }}

        muiTableHeadCellProps={{
          sx: {
            '& .Mui-TableHeadCell-Content': {
              display: 'flex',
              flexDirection: 'column',
            },
            '& .Mui-TableHeadCell-Content-Actions': {
              alignSelf: 'flex-end',
            }
          }
        }}
        muiTablePaperProps={{
          sx: {
            height: 'calc(100% - 96px)',
            flex:1,
            display: 'flex',
            flexDirection: 'column',
          }
        }}
        state={{
          showProgressBars: dataGridState.loading,
          rowSelection: selectedRows,
          sorting: sortState,
          columnVisibility,
          pagination,
          showColumnFilters,
          columnPinning: pinnedColumns,
          ...gridProps?.gridState
        }}
        onSortingChange={setSortState}
        rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
        rowVirtualizerProps={{ overscan: 10 }}
        initialState={{
          columnOrder: defaultColumnOrder,
          columnVisibility: defaultHideColumns,
          columnPinning: defaultPinnedColumns,
          showGlobalFilter: hasSearchFilter && filterable,
        }}
        enableGlobalFilter={true}
        onGlobalFilterChange={(f) => {
          debounceSearch(f)
        }}
        muiSearchTextFieldProps={{
          placeholder: searchPlaceholder ?? 'Search',
          variant: 'outlined',
          size: 'small',
        }}
        enableTopToolbar={false}
        onColumnPinningChange={(updater) => {
          setPinnedColumns((prev) =>
            updater instanceof Function ? updater(prev) : updater,
          );
          queueMicrotask(rerender); //hack to rerender after state update
        }}
        onColumnVisibilityChange={(updater) => {
          setColumnVisibility((prev) =>
            updater instanceof Function ? updater(prev) : updater,
          );
          queueMicrotask(rerender); //hack to rerender after state update
        }}
        onDensityChange={(updater) => {
          setDensity((prev) =>
            updater instanceof Function ? updater(prev) : updater,
          );
          queueMicrotask(rerender); //hack to rerender after state update
        }}
        onPaginationChange={(updater) => {
          setPagination((prev) =>
            updater instanceof Function ? updater(prev) : updater,
          );
          queueMicrotask(rerender); //hack to rerender after state update
        }}
        onShowColumnFiltersChange={(updater) => {
          setShowColumnFilters((prev) =>
            updater instanceof Function ? updater(prev) : updater,
          );
          queueMicrotask(rerender); //hack to rerender after state update
        }}
        renderDetailPanel={({ row }) => {
          return renderDetailPanel({ row })
        }}
        getRowId={(orow) => orow?.id}
        {...gridProps?.emptyRowsRenderer && {
          renderEmptyRowsFallback: () => {
            return gridProps?.emptyRowsRenderer()
          }
        }}
        renderBottomToolbar={() => {
          return renderBottomToolbar
        }}
        muiTableBodyRowProps={({ row }) => {
          const attribs = extendedRowAttributes(row?.original)
          return { ...attribs,
            title:null
          }
        }}
        {...gridProps}
      />
    </div>
  )
}

export { VirtuosoDataGrid };

