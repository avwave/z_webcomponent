import MaterialReactTable from 'material-react-table';
import React, { isValidElement, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useUrlState } from '../hooks/useUrlState';

import { LinearProgress } from '@material-ui/core';
import { Box, Toolbar, debounce } from '@mui/material';
import ReactJson from 'react-json-view';
import Truncate from 'react-truncate';
import { DataGridContext, actions as dataGridActions } from '../DataGrid/DataGridContext';
import { DataGridToolbar } from './DataGridToolbar';
import { PortalCell } from '../DataGrid/PortalCell';
const useStyles = makeStyles()(theme => ({
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
  onLoadMore = () => { },
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

  const enableRowSelection = Boolean(gridProps?.onSelectedRowsChange)
  const [selectedRows, setSelectedRows] = useState({});

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
            // enableHiding: !col?.hidden,
            Cell: ({ row, column, renderedCellValue, ...rest }) => {
              let finalizedCell = <></>
              if (col?.cellRenderer) {
                finalizedCell =  <div>{col?.cellRenderer({ row: row?.original })}</div>
              } else {
                const v = rest?.cell?.renderValue()
                if (isValidElement(renderedCellValue) || col?.key === 'select-row') {
                  finalizedCell =  <div>{renderedCellValue}</div>
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
              return finalizedCell
            }
          }
        })
      return cols
    }, [dataGridState?.columns]
  );

  //scroll events for loadmore
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 400
        ) {
          if (totalCount > dataGridState?.rows?.length) {
            onLoadMore && onLoadMore()
          }
        }
      }
    },
    [dataGridState?.rows?.length, onLoadMore, totalCount],
  );

  //check on mount if needs to load more to fill the table
  useEffect(
    () => {
      fetchMoreOnBottomReached(tableContainerRef.current)
    }, [fetchMoreOnBottomReached]
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
      if (enableRowSelection) {
        colmap.push('mrt-row-select')
      }
      if (tableComponents?.detailsRow?.content) {
        colmap.push('mrt-row-expand')
      }
      return colmap

    }, [enableRowSelection, tableComponents?.detailsRow?.content]
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

      return {
        left: [...defaultCols, ...cols],
      }
    }, [dataGridState?.columns]
  );
  const defaultHideColumns = useMemo(
    () => {
      if (dataGridState?.columns?.length <= 0) {
        return null
      }
      const objMap = dataGridState?.columns?.filter(col => col.hidden)?.map(col => [col.key, !col.hidden])
      const obj = Object.fromEntries(objMap)
      return obj
    }, [dataGridState?.columns]
  );

  useEffect(
    () => {
      const mapToArray = Object.keys(selectedRows).map((key) => key)
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

  const rerender = useReducer(() => ({}), {})[1];
  const [columnVisibility, setColumnVisibility] = useState({});
  const [density, setDensity] = useState('comfortable');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowSelection, setRowSelection] = useState({});
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [pinnedColumns, setPinnedColumns] = useState(defaultPinnedColumns);

  const renderDetailPanel = useCallback(
    ({ row }) => {
      const DetailRowComponent = tableComponents?.detailsRow?.content ?? <></>
      return <DetailRowComponent rowData={row?.original} />
    },
    [tableComponents?.detailsRow?.content],
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
        tableInstanceRef={tableInstanceRef}
        columnResizeMode='onChange'
        manualFiltering
        manualSorting
        memoMode="cells"
        enableDensityToggle={false}
        enableColumnOrdering
        enableColumnResizing
        enablePagination={false}
        enableRowVirtualization
        // enableColumnVirtualization
        enableRowSelection={enableRowSelection}
        enableHiding
        enableColumnDragging
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
            maxHeight: '70vh'
          },
          onScroll: (e) => {
            fetchMoreOnBottomReached(e.target)
          }
        }}
        state={{
          showProgressBars: dataGridState.loading,
          rowSelection: selectedRows,
          showSkeletons: false,
          sorting: sortState,
          columnVisibility,
          density,
          pagination,
          showColumnFilters,
          columnPinning: pinnedColumns,
        }}
        onSortingChange={setSortState}
        rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
        // rowVirtualizerProps={{ overscan: 4 }}
        initialState={{
          columnOrder: defaultColumnOrder,
          columnVisibility: defaultHideColumns,
          columnPinning: defaultPinnedColumns,
          showGlobalFilter: true,
        }}
        enableGlobalFilter={hasSearchFilter}
        onGlobalFilterChange={(f) => {
          debounceSearch(f)
        }}
        muiSearchTextFieldProps={{
          placeholder: 'Search',

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
      />
    </div>
  )
}

export { VirtuosoDataGrid };

