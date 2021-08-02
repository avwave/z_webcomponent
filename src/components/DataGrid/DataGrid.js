import {
  Backdrop,
  CircularProgress,
  LinearProgress,
  Toolbar,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
import {
  FilterRendererWrapper,
  OptionFilterRenderer,
  TextFilterRenderer,
} from "./FilterRenderer";
import { Tooltip as Tippy } from "react-tippy";
import "react-tippy/dist/tippy.css";
import { isEmpty } from "lodash";

import BlockUi from "react-loader-advanced";
import { findDOMNode } from "react-dom";

const styles = (theme) => ({
  tooltip: {
    lineHeight: theme.typography.caption.lineHeight,
    height: "100%",
    display: "flex",
    alignItems: "center",
    alignContent: "center",
  },
});

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

function DataGrid({
  classes,
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
}) {
  const [canvas, setCanvas] = useState(null);

  const domRef = React.useRef();

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

  const prevScrollY = useRef(0);

  const scrollListener = useCallback(
    (evt) => {
      const scrollOffset = evt?.currentTarget?.scrollHeight - (evt?.currentTarget?.scrollTop + evt?.currentTarget?.clientHeight)
      const newScrollTop = evt?.currentTarget?.scrollTop
      if (scrollOffset < 100 && evt?.currentTarget?.scrollTop > prevScrollY.current) {
        console.log("📢[DataGrid.js:92]: ", scrollOffset);
        onLoadMore();
      }
      prevScrollY.current = newScrollTop
    }, [onLoadMore]
  );

  React.useEffect(() => {
    const c = domRef.current.element;
    if (onLoadMore) {
      if (domRef.current && !canvas) {
        c.addEventListener("scroll", scrollListener, { passive: true });
        setCanvas(c);
      }
    } 
      
  }, [canvas, onLoadMore, scrollListener]);

  React.useEffect(() => {
    return function cleanup() {
      canvas?.removeEventListener("scroll", scrollListener);
    };
  }, []);

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
    function HeaderRenderer({ component, ...props }) {
      return (
        <DraggableHeaderRenderer
          {...props}
          onColumnsReorder={handleColumnReorder}
          component={component}
        />
      );
    }

    return columns.map((c) => {
      c.headerRenderer = (args) => (
        <HeaderRenderer {...args} component={c.columnHeaderRenderer} />
      );
      return c;
    });
  }, [columns]);

  React.useEffect(() => {
    const cols = dataGridState.columns.map((c) => {
      if (c.key === "id") return c;

      if (!c.formatter) {
        c.formatter = (props) => {
          const element = props.row[props.column.key];
          const isReactElem = React.isValidElement(element);
          const tooltip =
            typeof props.row[props.column.key] === "object"
              ? isReactElem
                ? element
                : JSON.stringify(element)
              : element;
          const cellRenderer = !!c.cellRenderer ? (
            c.cellRenderer(props)
          ) : (
            <span style={c.cellStyles}>{isReactElem ? element : tooltip}</span>
          );
          const renderedTooltip =
            typeof c.tooltip === "function" ? c?.tooltip(props) : tooltip;
          if (c.noTooltip || isEmpty(renderedTooltip)) {
            return cellRenderer;
          } else {
            return (
              <LightTooltip
                title={renderedTooltip}
                placement="bottom-start"
                className={classes.tooltip}
              >
                {cellRenderer}
              </LightTooltip>
            );
          }
        };
      }

      switch (c.filter?.type) {
        case "text":
          c.filterRenderer = (args) => {
            return <TextFilterRenderer {...args} filter={c?.filter} />;
          };
          break;
        case "option":
          c.filterRenderer = (args) => (
            <OptionFilterRenderer {...args} filter={c?.filter} />
          );
          break;
        default:
          break;
      }

      return c;
    });
    setColumns(cols);
  }, [dataGridState.columns]);

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
    <BlockUi
      message={<CircularProgress />}
      backgroundStyle={{ backgroundColor: "#ffffffcc" }}
      show={dataGridState.loading}
      style={{ ...containerStyle }}

    >
      <DataGridToolbar
        columns={draggableColumns}
        showSelector={showSelector}
        filterable={filterable}
        onFilterChange={setFilters}
        rightAccessory={rightAccessory}
        leftAccessory={leftAccessory}
        centerAccessory={centerAccessory}
        totalCount={totalCount}
        loadedCount={dataGridState.rows.length}
      />
      <ReactDataGrid
        ref={domRef}
        className={"rdg-light"}
        headerFiltersHeight={50}
        rowRenderer={RowRenderer}
        {...gridProps}
        style={{ ...style }}
        columns={draggableColumns}
        rows={dataGridState.rows}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        enableCellSelect={true}
        onSort={handleSort}
        enableFilterRow={filterable}
        filters={dataGridState.filterColumn}
        onFiltersChange={(a) => {
          setFilters({ ...filters, ...a });
        }}
      />
      {contextMenu?.contextItems() ?? <></>}
    </BlockUi>
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
