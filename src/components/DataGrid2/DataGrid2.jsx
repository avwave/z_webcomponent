import { DataTypeProvider, SortingState } from '@devexpress/dx-react-grid';
import { ColumnChooser, DragDropProvider, Grid, Table, TableColumnReordering, TableColumnResizing, TableColumnVisibility, TableFixedColumns, TableHeaderRow, Toolbar, VirtualTable } from '@devexpress/dx-react-grid-material-ui';
import { Tooltip, IconButton, makeStyles, withStyles, Paper } from '@material-ui/core';
import { ViewColumn } from '@material-ui/icons';
import { isEmpty } from 'lodash-es';
import React, { isValidElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { actions as dataGridActions, DataGridContext } from "../DataGrid/DataGridContext";
import DataGridToolbar from '../DataGrid/DataGridToolbar';
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
  return <Table.Cell {...props} style={{ ...props.style, ...props.column?.cellStyles }} />
}
const Root = props => <Grid.Root {...props} style={{ height: '100%' }} />;

const TooltipFormatter = ({ value, row, column, ...props }) => {
  const classes = useStyles();
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
    setHiddenColumnNames(dataGridState.columns.filter(col => col.hidden).map(col => col.key));
    setSorting(dataGridState.columns.filter(col => col.sortable).map(col => {
      return {
        columnName: col.key,
        direction: 'asc'
      }
    }))
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
      >
        <DragDropProvider />
        <DataTypeProvider
          for={columns.map(({ name }) => name)}
          formatterComponent={TooltipFormatter} {...props} />
        <SortingState
          sorting={sorting}
          onSortingChange={(sort) => {
            setSorting(sort)
            handleSort(sort[0]?.columnName, sort[0]?.direction)
          }}
        />

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
        <TableHeaderRow showSortingControls />
        <TableColumnVisibility
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
        <TableFixedColumns leftColumns={fixedColumns} />
      </Grid>
    </Paper>
  )
}

export { DataGrid2 }