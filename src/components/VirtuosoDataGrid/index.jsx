import MaterialReactTable from 'material-react-table';

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
  const theme = useTheme()
  const tableContainerRef = useRef(null)
  const tableInstanceRef = useRef(null)
  const rowVirtualizerInstanceRef = useRef(null)

  const [globalFilter, setGlobalFilter] = useState('');

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
                return <div draggable className={classes.truncate}>{col?.columnHeaderRenderer()}</div>
              } else {
                return <div draggable className={classes.truncate}>{col?.name}</div>
              }
            },
            Cell: ({ row, column, renderedCellValue, ...rest }) => {
              let toolTipCell = renderedCellValue
              let finalizedCell = <></>
              if (col?.cellRenderer) {
                finalizedCell = (
                  <Typography
                    variant='body2'
                    noWrap
                  >
                    {col?.cellRenderer({ row: row?.original, renderedCellValue })}
                  </Typography>
                )
                toolTipCell = col?.cellRenderer({ row: row?.original, renderedCellValue })
              } else {
                const v = rest?.cell?.renderValue()
                // if (isValidElement(renderedCellValue) || col?.key === 'select-row') {
                //   finalizedCell = <div>{renderedCellValue}</div>
                // } else {
                  finalizedCell = <div style={{width:'100%'}}>
                    {/* <TruncateMarkup
                      lines={col?.truncateLines ?? 1}
                    > */}
                      <Typography 
                      variant='body2'
                      noWrap
                       style={col?.cellStyles}>
                        {renderedCellValue}
                      </Typography>
                    {/* </TruncateMarkup> */}
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
                  title={renderedTooltip}
                  placement="bottom-start"
                  className={classes.tooltip}
                >
                  {finalizedCell}
                </LightTooltip>
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
      setLoadMoreLoading(true)
      await onLoadMore()
      setShowManualLoadMore(false)
      setLoadMoreLoading(false)
    },
    [onLoadMore],
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


  if (defaultHideColumns === null && defaultColumnOrder === null)
    return <LinearProgress />

  return (
    <div className={classes.rootContainer}>
      {renderAccessories}
      <DataGridToolbar
        alternateToolbarFilter={alternateToolbarFilter}
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
      <ThemeProvider theme={createTheme({
        components: {
          MuiTableSortLabel: {
            styleOverrides: {
              icon: {
                opacity: .20,
              },
            }
          }
        }
      })}
      >
        <MaterialReactTable
          enableFilterMatchHighlighting
          localization={tableTranslation}
          className={classes.table}
          tableInstanceRef={tableInstanceRef}
          columnResizeMode='onChange'
          manualFiltering
          manualSorting
          memoMode="cells"
          enableDensityToggle
          enableColumnOrdering
          enableColumnResizing
          enableExpandAll={false}
          enablePagination={false}
          enableRowVirtualization
          // enableColumnVirtualization
          enableRowSelection={enableTableSelection ? row => enableRowSelection(row) : false}
          enableHiding
          enableGrouping={false}
          enableColumnDragging={false}
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
              flex: 1
            },
            onScroll: (e) => {
              fetchMoreOnBottomReached(e.target, manualLoadMore)
            },
            ...gridProps?.tableContainerProps
          }}

          muiTableHeadCellProps={({ column, table }) => {
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
              sx: {
                userSelect: 'none',
                '& .Mui-TableHeadCell-Content': {
                  display: 'flex',
                  flexDirection: 'row',
                },
                '& .Mui-TableHeadCell-Content-Actions': {
                  alignSelf: 'flex-end',
                },
                '& .Mui-TableHeadCell-Content-Wrapper': {
                  whiteSpace: 'nowrap',
                },
                backgroundColor: theme.palette.grey[100]

              }
            }
          }}
          muiTablePaperProps={{
            sx: {
              height: 'calc(100% - 96px)',
              flex: 1,
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
            density: density,
            globalFilter,
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
            setGlobalFilter(f)
            debounceSearch(f)
          }}
          muiSearchTextFieldProps={(props) => {
            return {
              placeholder: searchPlaceholder ?? 'Search',
              variant: 'outlined',
              size: 'small',
              InputProps: {
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
            return {
              ...attribs,
              title: null
            }
          }}
          {...gridProps}
        />
      </ThemeProvider>
    </div>
  )
}

export { VirtuosoDataGrid };

