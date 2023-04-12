import MaterialReactTable, { MRT_FullScreenToggleButton, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton } from 'material-react-table';
import React, { isValidElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useUrlState } from '../hooks/useUrlState';

import { LinearProgress } from '@material-ui/core';
import Truncate from 'react-truncate';
import { DataGridContext } from '../DataGrid/DataGridContext';
import { DataGridToolbar } from './DataGridToolbar';
import { Box, Typography } from '@mui/material';
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
      const cols = dataGridState?.columns?.map((col) => {
        return {
          header: col.name,
          accessorKey: col.key,
          enableSorting: !!col.sortable,
          // enableHiding: !col?.hidden,
          Cell: ({ row, column, renderedCellValue, ...rest }) => {
            if (col?.cellRenderer) {
              return <div>{col?.cellRenderer({ row: row?.original })}</div>
            } else {
              const v = rest?.cell?.renderValue()
              if (isValidElement(renderedCellValue) || col?.key === 'select-row') {
                return <div>{renderedCellValue}</div>
              }
              return <div>
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
          onLoadMore && onLoadMore()
        }
      }
    },
    [onLoadMore],
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

  const defaultColumnOrder = useMemo(
    () => {
      if (dataGridState?.columns?.length <= 0) {
        return null
      }
      const cols = dataGridState?.columns?.map((col) => col.key)
      if (enableRowSelection) {
        return ['mrt-row-select', ...cols]
      }
      return cols
    }, [dataGridState?.columns]
  );

  const defaultPinnedColumns = useMemo(
    () => {
      const cols = dataGridState?.columns?.filter(col => col.frozen)?.map(col => col.key)
      if (enableRowSelection) {
        return {
          left: ['mrt-row-select', ...cols],
        }
      }
      return {
        left: cols,
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

  if (defaultHideColumns === null && defaultColumnOrder === null)
    return <LinearProgress />

  return (
    <div className={classes.rootContainer}>
      <DataGridToolbar
        tableRef={tableInstanceRef}
        useUrlAsState={useUrlAsState}
        hasDateRangeFilter={hasDateRangeFilter}
        searchPlaceholder={searchPlaceholder}
        hasSearchFilter={hasSearchFilter}
        columns={dataGridState?.columns}
        showSelector={showSelector}
        filterable={filterable}
        onFilterChange={(f) => {
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
      <MaterialReactTable
        tableInstanceRef={tableInstanceRef}
        columnResizeMode='onChange'
        manualFiltering
        manualSorting
        memoMode="cells"
        enableDensityToggle={false}
        enableGlobalFilter={false}
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
        }}
        onSortingChange={setSortState}
        rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
        rowVirtualizerProps={{ overscan: 4 }}
        initialState={{
          columnOrder: defaultColumnOrder,
          columnVisibility: defaultHideColumns,
          columnPinning: defaultPinnedColumns,
        }}

      />
    </div>
  )
}

export { VirtuosoDataGrid };

