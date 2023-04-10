import MaterialReactTable from 'material-react-table';
import React, { useContext, useMemo } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useUrlState } from '../hooks/useUrlState';

import { DataGridContext } from '../DataGrid/DataGridContext';
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


  const data = useMemo(
    () => {
      const rows = dataGridState?.rows
      return rows
    }, [dataGridState?.rows]
  );

  const columns = useMemo(
    () => {
      const cols = dataGridState?.columns
      return cols?.map((col) => {
        return {
          header: col.name,
          accessorKey: col.key,
        }
      })
    }, [dataGridState?.columns]
  );

  return (
    <MaterialReactTable
      enableGlobalFilter={false}
      enableColumnOrdering
      enableColumnResizing
      enableColumnVirtualization
      enableRowSelection
      enableColumnFilters={false}
      data={data}
      columns={columns}
    />
  )
}

export { VirtuosoDataGrid };

