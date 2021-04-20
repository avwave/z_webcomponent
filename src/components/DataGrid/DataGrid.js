import {
  LinearProgress,
  Toolbar,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import { useContextMenu } from "react-contexify";
import ReactDataGrid, { Row } from "react-data-grid";
import styled from "styled-components";
import { status } from "../Checkbox/Checkbox";
import CheckboxProvider, {
  actions as checkboxActions,
  CheckboxContext,
} from "../CheckList/checklistContext";
import "./context.scss";
import { actions as dataGridActions, DataGridContext } from "./DataGridContext";
import DataGridToolbar from "./DataGridToolbar";
import { DraggableHeaderRenderer } from "./DraggableHeaderRenderer";
import { OptionFilterRenderer, TextFilterRenderer } from "./FilterRenderer";
import { Tooltip as Tippy } from "react-tippy";
import "react-tippy/dist/tippy.css";
import { isEmpty } from "lodash";

const styles = (theme) => ({
  tooltip: {
    lineHeight: theme.typography.caption.lineHeight,
  },
});

function DataGrid({
  classes,
  draggable,
  showSelector,
  filterable,
  style,
  containerStyle,
  gridProps,
  contextMenu,
}) {
  const [checkListState, checkListDispatch] = React.useContext(CheckboxContext);
  const [dataGridState, dataGridDispatch] = React.useContext(DataGridContext);

  const [columns, setColumns] = useState(dataGridState.columns);
  const [filters, setFilters] = useState({});

  const { show: showContextMenu } = useContextMenu({
    id: contextMenu?.menuId ?? "CONTEXT_MENU_ID",
  });

  function displayMenu(e, row) {
    showContextMenu(e, { props: { row } });
  }

  React.useEffect(() => {
    const defaultItems = dataGridState.columns.map((col) => {
      return {
        id: col.colId,
        title: col.name,
        state: col.hidden ? status.UNCHECKED : status.CHECKED,
      };
    });
    checkListDispatch({
      payload: { items: defaultItems },
      type: checkboxActions.LOAD_ITEMS,
    });
  }, [checkListDispatch, dataGridState.columns]);

  const draggableColumns = useMemo(() => {
    function handleColumnReorder(sourceKey, targetKey) {
      const sourceColumnIndex = columns.findIndex((c) => c.key === sourceKey);
      const targetColumnIndex = columns.findIndex((c) => c.key === targetKey);
      const reorderedColumns = [...columns];

      reorderedColumns.splice(
        targetColumnIndex,
        0,
        reorderedColumns.splice(sourceColumnIndex, 1)[0]
      );

      setColumns(reorderedColumns);
    }
    function HeaderRenderer(props) {
      return (
        <DraggableHeaderRenderer
          {...props}
          onColumnsReorder={handleColumnReorder}
        />
      );
    }

    return columns.map((c) => {
      c.headerRenderer = HeaderRenderer;
      return c;
    });
  }, [columns]);

  React.useEffect(() => {
    const cols = dataGridState.columns.map((c) => {
      if (c.key === "id") return c;

      if (!c.formatter) {
        c.formatter = (props) => {
          return (
            <Tippy
              disabled={c.noTooltip}
              title={props.row[props.column.key] ?? "  "}
              position="bottom-start"
              trigger="mouseenter"
              interactive
              sticky
              distance={0}
              theme="light"
              // className={classes.tooltip}
            >
              {c.cellRenderer ? (
                c.cellRenderer(props)
              ) : (
                <span style={c.cellStyles}>{props.row[props.column.key]}</span>
              )}
            </Tippy>
          );
        };
      }

      const filterItem = dataGridState.filterColumn[c.key]
      
      switch (c.filter?.type) {
        case "text":
          c.filterRenderer = (args) => {
            return <TextFilterRenderer {...args} value={filterItem}/>;
          };
          break;
        case "option":
          c.filterRenderer = (args) => (
            <OptionFilterRenderer {...args} filter={c?.filter} value={filterItem}/>
          );
          break;
    
        default:
          break;
      }
      return c;
    });
    setColumns(cols);
  }, [dataGridState.columns, dataGridState.filterColumn]);

  React.useEffect(() => {
    let copyColumns = dataGridState.columns;
    let filteredColumns = [];

    checkListState.items.forEach((checkItem) => {
      const idx = copyColumns.findIndex((col) => col.colId === checkItem.id);
      filteredColumns.push(copyColumns[idx]);
      if (checkItem.state === status.CHECKED) {
      }
    });

    filteredColumns = copyColumns.filter((col) => {
      const chbxstate = checkListState.items.find(
        (chkbx) => col.colId === chkbx.id
      );
      if (!chbxstate) return false;
      return chbxstate.state === status.CHECKED;
    });

    setColumns(filteredColumns);
  }, [checkListState, dataGridState.columns]);

  const [[sortColumn, sortDirection], setSort] = useState(["", "NONE"]);

  function RowRenderer(props) {
    const contextProp = contextMenu
      ? { onContextMenu: (e) => displayMenu(e, props.row) }
      : {};
    return <Row {...contextProp} {...props} />;
  }

  const handleSort = useCallback(
    (sortColumn, sortDirection) => {
      dataGridDispatch({
        type: dataGridActions.SORT_COLUMN,
        payload: {
          sortColumn,
          sortDirection,
        },
      });
      setSort([sortColumn, sortDirection]);
    },
    [dataGridDispatch]
  );

  React.useEffect(() => {
    dataGridDispatch({
      type: dataGridActions.FILTER_COLUMN,
      payload: {
        filterColumn: filters,
      },
    });
  }, [dataGridDispatch, filters]);

  return (
    <div style={{ ...containerStyle }}>
      <DataGridToolbar
        columns={draggableColumns}
        showSelector={showSelector}
        filterable={filterable}
        onFilterChange={setFilters}
      />
      {dataGridState.loading ? <LinearProgress /> : null}
      <ReactDataGrid
        {...gridProps}
        style={{ ...style }}
        columns={draggableColumns}
        rows={dataGridState.rows}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        enableCellSelect={true}
        onSort={handleSort}
        enableFilterRow={filterable}
        filters={dataGridState.filters}
        onFiltersChange={(a)=>{
          setFilters({...filters, ...a})
        }}
        rowRenderer={RowRenderer}
      />
      {contextMenu?.contextItems() ?? <></>}
    </div>
  );
}

function DGWrapper(props) {
  return (
    <CheckboxProvider>
      <DataGrid {...props} />
    </CheckboxProvider>
  );
}

export default withStyles(styles)(DGWrapper);

DataGrid.propTypes = {
  draggable: PropTypes.bool,
  showSelector: PropTypes.bool,
  filterable: PropTypes.bool,
};
