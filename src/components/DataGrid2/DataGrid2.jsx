import { DataTypeProvider, IntegratedSelection, SelectionState, SortingState, VirtualTableState } from '@devexpress/dx-react-grid';
import { ColumnChooser, DragDropProvider, Grid, Table, TableColumnReordering, TableColumnResizing, TableColumnVisibility, TableFixedColumns, TableHeaderRow, TableSelection, Toolbar, VirtualTable } from '@devexpress/dx-react-grid-material-ui';
import { CircularProgress, IconButton, lighten, makeStyles, Paper, Tooltip, withStyles } from '@material-ui/core';
import { ViewColumn } from '@material-ui/icons';
import clsx from 'clsx';
import { isEmpty } from 'lodash-es';
import React, { isValidElement, useCallback, useContext, useEffect, useState } from 'react';
import { SELECT_COLUMN_KEY } from 'react-data-grid';
import BlockUi from "react-loader-advanced";
import { actions as dataGridActions, DataGridContext } from "../DataGrid/DataGridContext";
import { DGToolbar } from './DGToolbar';

const useStyles = makeStyles((theme) => {
  return {
    tooltip: {
      lineHeight: theme.typography.caption.lineHeight,
      height: "100%",
      display: "flex",
      alignItems: "center",
      alignContent: "center",
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(14),
      border: "1px solid #dadde9",
    },
    headerRow: {
      textTransform: 'uppercase',
      backgroundColor: lighten(theme.palette.primary.light, 0.75)
    },
    cell: {
      borderRight: '1px solid #f0f0f0',
    }
  }
})
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const Cell = (props) => {
  const classes = useStyles();
  return <Table.Cell {...props} size="small" className={clsx(props.className, classes.cell)} style={{ ...props.style, ...props.column?.cellStyles }} />
}

const Root = props => <Grid.Root {...props} style={{ height: '100%' }} />;

const HeaderRowCell = ({ ...restProps }) => {
  const classes = useStyles();
  return (
    <TableHeaderRow.Cell {...restProps} size="small" className={clsx(restProps.className, classes.cell, classes.headerRow)} />
  )
}


const TooltipFormatter = ({ value, row, column, ...props }) => {
  const element = row[column.key];
  const isReactElem = isValidElement(element);
  const tooltip =
    typeof row[column.key] === "object"
      ? isReactElem
        ? element
        : JSON.stringify(element)
      : element;

  const renderedTooltip =
    typeof column?.tooltip === "function" ? column?.tooltip(props) : tooltip;
  if (column?.noTooltip || isEmpty(renderedTooltip)) {
    return <span>{value}</span>
  } else {
    return (
      <LightTooltip placement="bottom-start"
        // className={classes.tooltip}
        title={renderedTooltip}>
        <span>
          {value}
        </span>
      </LightTooltip>
    )
  }

}

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
  onLoadMore,
  totalCount,
  resetScroll,
  pageOffset,
  pageSize,
  ...props }) => {
  const classes = useStyles()
  const [dataGridState, dataGridDispatch] = useContext(DataGridContext);

  const [columns, setColumns] = useState(dataGridState.columns);
  const [rows, setRows] = useState(dataGridState.rows);
  const [filters, setFilters] = useState({});

  const [tableColumnExtenstions, setTableColumnExtenstions] = useState([]);

  const [columnOrder, setColumnOrder] = useState([]);
  const [columnWidths, setColumnWidths] = useState([]);
  const [columnExtensions, setColumnExtensions] = useState([]);

  const [sorting, setSorting] = useState([]);

  const [fixedColumns, setFixedColumns] = useState([]);
  const [hiddenColumnNames, setHiddenColumnNames] = useState([]);

  const [selection, setSelection] = useState([...gridProps?.selectedRows??[]]);

  const [hasSelectable, setHasSelectable] = useState(false);
  useEffect(() => {
    setRows(dataGridState.rows);
  }, [dataGridState.rows]);

  useEffect(() => {
    setColumns(dataGridState.columns.map((column) => {
      return { ...column, name: column.key, title: column.name }
    }));
    setTableColumnExtenstions(dataGridState.columns.map(col => {
      return {
        columnName: col.key,
        wordWrapEnabled: true,
      }
    }))
  }, [dataGridState.columns]);

  useEffect(() => {
    setColumnOrder(dataGridState.columns.map(col => col.key));
  }, [dataGridState.columns]);

  useEffect(() => {
    setColumnWidths(dataGridState.columns.map(col => {
      return {
        columnName: col.key,
        width: (col.minWidth ?? col.width) ?? 200
      }
    }));
    setColumnExtensions(dataGridState.columns.map(col => {
      return {
        columnName: col.key,
        minWidth: col.minWidth ?? 200
      }
    }));
    setFixedColumns(dataGridState.columns.filter(col => col.frozen).map(col => col.key));
    setHiddenColumnNames(dataGridState.columns.filter(col => col.hidden || col.key === SELECT_COLUMN_KEY).map(col => col.key));
    setSorting(dataGridState.columns.filter(col => col.sortable).map(col => {
      return {
        columnName: col.key,
        direction: 'asc'
      }
    }))
    const selable = dataGridState.columns.some(col => col.key === SELECT_COLUMN_KEY)
    setHasSelectable(selable);

  }, [dataGridState.columns]);

  useEffect(() => {
    dataGridDispatch({
      type: dataGridActions.FILTER_COLUMN,
      payload: {
        filterColumn: filters,
      },
    });
  }, [dataGridDispatch, filters]);

  const handleSort = useCallback(
    (sortColumn, sortDirection) => {
      dataGridDispatch({
        type: dataGridActions.SORT_COLUMN,
        payload: {
          sortColumn,
          sortDirection: sortDirection.toUpperCase(),
        },
      });
    },
    [dataGridDispatch]
  );

  return (
    <Paper style={containerStyle}>
      <Grid {...gridProps} rows={rows}
        columns={columns}
        rootComponent={Root}
        getRowId={row => row.id}
      >
        <DragDropProvider />
        <DataTypeProvider
          for={columns.map(({ name }) => name)}
          formatterComponent={TooltipFormatter} {...props}
        />
        <SortingState
          sorting={sorting}
          onSortingChange={(sort) => {
            setSorting(sort)
            handleSort(sort[0]?.columnName, sort[0]?.direction)
          }}
        />

        <SelectionState
          selection={selection}
          onSelectionChange={(selRows) => {
            setSelection(selRows)
            gridProps?.onSelectedRowsChange(selRows)
          }}
        />
        <IntegratedSelection />
        {onLoadMore && (
          <VirtualTableState
            loading={dataGridState.loading}
            totalRowCount={totalCount}
            pageSize={pageSize}
            skip={pageOffset}
            getRows={(skip, take) => {
              onLoadMore({ pageOffset: skip, pageSize: take })
            }}
          />
        )}
        <VirtualTable
          columnExtensions={tableColumnExtenstions}
          cellComponent={Cell}
          height="auto"
        />
        <TableColumnReordering
          order={columnOrder}
          onOrderChange={setColumnOrder}
        />
        <TableColumnResizing
          resizingMode="nextColumn"
          columnWidths={columnWidths}
          columnExtensions={columnExtensions}
          onColumnWidthsChange={setColumnWidths}
        />
        <TableHeaderRow showSortingControls
          cellComponent={HeaderRowCell}
        />
        <TableColumnVisibility
          messages={{
            noColumns:''
          }}
          hiddenColumnNames={hiddenColumnNames}
          onHiddenColumnNamesChange={setHiddenColumnNames}
        />
        <Toolbar />
        <ColumnChooser
          toggleButtonComponent={({
            onToggle,
            getMessage,
            buttonRef,
            active,
            ...restProps
          }) => (
            <Tooltip
              title={getMessage("showColumnChooser")}
              placement="bottom"
              enterDelay={300}
            >
              <IconButton onClick={onToggle}{...restProps}>
                <ViewColumn />
              </IconButton>
            </Tooltip>
          )}
        />
        <DGToolbar
          columns={dataGridState.columns}
          showSelector={false}
          filterable={filterable}
          onFilterChange={setFilters}
          rightAccessory={rightAccessory}
          leftAccessory={leftAccessory}
          centerAccessory={centerAccessory}
          totalCount={dataGridState.rows.length}
          loadedCount={dataGridState.rows.length}
        />
        {hasSelectable && (
          <TableSelection showSelectAll/>
        )}
        <TableFixedColumns leftColumns={fixedColumns} />
      </Grid>
    </Paper>
  )
}

export { DataGrid2 };
