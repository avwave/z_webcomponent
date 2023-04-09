import { makeStyles } from '@material-ui/core';
import React, { useContext, useMemo } from 'react';
import { useFlexLayout, useResizeColumns, useRowSelect, useTable } from 'react-table';
import { TableVirtuoso } from 'react-virtuoso';
import { DataGridContext } from '../DataGrid/DataGridContext';
import { useUrlState } from '../hooks/useUrlState';
import clsx from 'clsx';
import Truncate from 'react-truncate';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'block',
    overflow: 'auto',
  },
  table: {
    borderSpacing: 0,
    
  },
  thead: {
    overflowY: 'auto',
    overflowX: 'hidden',
    background: theme.palette.grey[200],
  },
  tbody: {
    overflowY: 'scroll',
    overflowX: 'hidden',
    height: '100%',
    zIndex: 0,
  },
  tr: {
    borderBottom: '1px solid #ccc',
    display: 'flex'
  },
  frozen:{
    position: 'sticky !important',
    left: 0,
    top:0,
    background: theme.palette.grey[50]
  },
  frozenHeader: {
    position: 'sticky !important',
    left: 0,
    top: 0,
    background: theme.palette.grey[200],
    zIndex: 1
  },
  th: {
    margin: 0,
    padding: '.5em',
    borderRight: '1px solid #ccc',
    '&:last-child': {
      borderRight: 0,
    },
    fontWeight: 'bolder',
    background: theme.palette.grey[200]
  },
  td: {
    margin: 0,
    padding: '.5em',
    borderRight: '1px solid #ccc',
    '&:last-child': {
      borderRight: 0,
    },
    // flex:1
  },
  resizer: {
    right: 0,
    width: 5,
    position: 'absolute',
    top: 0,
    bottom: 0,
    touchAction: 'none',
    background: theme.palette.primary.main,
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
  const classes = useStyles()

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

  const columns = useMemo(
    () => {
      const colNumber = dataGridState?.columns?.filter(col => !col?.hidden).length || 0
      const cols = dataGridState?.columns?.map((col) => {
        return {
          accessor: col.key,
          
          Cell: (cellProps) => {
            if (col?.cellRenderer) {
              return <>{col?.cellRenderer(cellProps)}</>
            } else {
              if (typeof cellProps?.value === 'string') {
                return (
                  <div>
                    <Truncate
                      // width={col?.width}
                      lines={col?.truncateLines ?? 2} ellipsis={<span>(...)</span>}
                      style={col.cellStyles}
                    >
                      {cellProps?.value}
                    </Truncate>
                  </div>
                )
              }
              return <span style={col?.cellStyle}>{cellProps?.value}</span>
            }
          },
          Header: col?.name,
          width: col?.width || 150,
          // width: col?.width || 50,
          // maxWidth: col?.maxWidth || 50,
          disableResizing: !col?.resizable,
          isFrozen: !!col?.frozen
        }
      })
      return cols
    }, [dataGridState?.columns]
  );

  const data = useMemo(
    () => {
      const rows = dataGridState?.rows
      return rows
    }, [dataGridState?.rows]
  );

  const hiddenColumns = useMemo(
    () => {
      return dataGridState?.columns?.filter(col => !!col?.hidden).map(col => col.key) || []
    }, [dataGridState?.columns]
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    initialState: {
      hiddenColumns: hiddenColumns
    }
  },
    useFlexLayout,
    useRowSelect,
    useResizeColumns
  )

  return (
    <TableVirtuoso
      className={classes.container}
      totalCount={rows.length}
      components={{
        Table: ({ style, ...props }) => <table className={classes.table} {...getTableProps()} {...props} style={{ ...style, tableLayout: 'fixed' }} />,
        TableHead: ({ style, ...props }) => <thead className={classes.thead} {...props} style={{ ...style, top: -1, tableLayout: 'fixed' }} />,
        TableBody: React.forwardRef(({ style, ...props }, ref) => <tbody className={classes.tbody} {...getTableBodyProps()} {...props} ref={ref} />),
        TableRow: (props) => {
          const index = props['data-index']
          const row = rows[index]
          return <tr className={classes.tr} {...props} {...row.getRowProps()} />
        },
      }}
      fixedHeaderContent={() => {
        return headerGroups.map((headerGroup) => (
          <tr className={classes.tr} {...headerGroup.getHeaderGroupProps()} style={{ background: 'white' }}>
            {headerGroup.headers.map((column) => (
              <th
                className={clsx(column?.isFrozen ? classes.frozenHeader : null, classes.th)}
                {...column.getHeaderProps()}
              >
                {column.render('Header')}
                {column.canResize && (
                  <div
                    {...column?.getResizerProps()}
                    className={classes.resizer}
                  />
                )}
              </th>
            ))}
          </tr>
        ))
      }}
      itemContent={(index, user) => {
        const row = rows[index]
        prepareRow(row)
        return row.cells.map((cell) => {
          return <td
            className={clsx(cell?.column?.isFrozen?classes.frozen:null, classes.td)}
            {...cell.getCellProps()}
          >
            {cell.render('Cell')}
          </td>
        })
      }}
    />
  )
}

export { VirtuosoDataGrid };
