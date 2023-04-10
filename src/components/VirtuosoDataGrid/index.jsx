import MaterialReactTable from 'material-react-table';
import React, { isValidElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useUrlState } from '../hooks/useUrlState';

import { DataGridContext } from '../DataGrid/DataGridContext';
import Truncate from 'react-truncate';
import { LinearProgress } from '@material-ui/core';
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
  const rowVirtualizerInstanceRef = useRef(null)

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
          enableHiding: !!col?.hidden,
          Cell: ({ row, renderedCellValue, ...rest }) => {
            if (col?.cellRenderer) {
              return <div>{col?.cellRenderer({ row: row?.original })}</div>
            } else {
              const v = rest?.cell?.renderValue()
              if (isValidElement(renderedCellValue) || col?.key==='select-row') {
                return <div>{renderedCellValue}</div>
              }
              return <div>
                <Truncate
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
      return ['mrt-row-select', ...cols]
    }, [dataGridState?.columns]
  );

  const defaultHideColumns = useMemo(
    () => {
      if (dataGridState?.columns?.length <= 0) {
        return null
      }
      const objMap = dataGridState?.columns?.filter(col=>col.hidden)?.map(col => [col.key, !col.hidden])
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

  if (defaultHideColumns === null && defaultColumnOrder === null) {
    return <LinearProgress/>
  }
  return (
    <MaterialReactTable
      columnResizeMode='onChange'
      manualFiltering
      manualSorting
      memoMode="cells" 
      enableDensityToggle={false}
      enableColumnOrdering
      enableColumnResizing
      enablePagination={false}
      enableRowVirtualization
      enableColumnVirtualization
      enableRowSelection
      enableHiding
      enableColumnDragging
      enableColumnFilters={false}
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
      }}
      onSortingChange={(sortArr) => {
        setSortColumn(sortArr?.[0]?.id)
        setSortDirection(sortArr?.[0]?.desc ? "desc" : "asc")
      }}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
      rowVirtualizerProps={{ overscan: 4 }}
      initialState={{
        columnOrder: defaultColumnOrder,
        columnVisibility: defaultHideColumns,
      }}
    />
  )
}

export { VirtuosoDataGrid };

