import {
  LinearProgress,
  Popover,
  Toolbar,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import ReactDataGrid from "react-data-grid";
import styled from "styled-components";
import { Button } from "../Button";
import { status } from "../Checkbox/Checkbox";
import { Checklist } from "../CheckList";
import CheckboxProvider, {
  actions as checkboxActions,
  CheckboxContext,
} from "../CheckList/checklistContext";
import { actions as dataGridActions, DataGridContext } from "./DataGridContext";
import { DraggableHeaderRenderer } from "./DraggableHeaderRenderer";
import {
  NumericFilter,
  OptionFilterRenderer,
  TextFilterRenderer,
} from "./FilterRenderer";

const styles = (theme) => ({});
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const StyledAppBar = styled(Toolbar)`
  && {
    background-color: #fff;
  }
`;

function DataGrid({
  classes,
  draggable,
  showSelector,
  filterable,
  style,
  containerStyle,
  gridProps,
}) {
  const [checkListState, checkListDispatch] = React.useContext(CheckboxContext);
  const [dataGridState, dataGridDispatch] = React.useContext(DataGridContext);

  const [columns, setColumns] = useState(dataGridState.columns);
  const [filters, setFilters] = useState(null);

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

  const draggableColumns = useMemo(() => {
    function HeaderRenderer(props) {
      return (
        <DraggableHeaderRenderer
          {...props}
          onColumnsReorder={handleColumnReorder}
        />
      );
    }

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

    return columns.map((c) => {
      if (c.key === "id") return c;
      if (!c.formatter) {
        c.formatter = (props) => {
          if (!c.noTooltip) {
            return (
              <LightTooltip
                title={props.row[props.column.key] ?? ""}
                placement="bottom-start"
                className={classes.tooltip}
              >
                {c.cellRenderer ? (
                  c.cellRenderer(props)
                ) : (
                  <span style={c.cellStyles}>
                    {props.row[props.column.key]}
                  </span>
                )}
              </LightTooltip>
            );
          } else {
            return (
              <span style={c.cellStyles}>{props.row[props.column.key]}</span>
            );
          }
        };
      }

      c.headerRenderer = HeaderRenderer;
      switch (c.filter?.type) {
        case "text":
          c.filterRenderer = TextFilterRenderer;
          break;
        case "option":
          c.filterRenderer = (args) => (
            <OptionFilterRenderer {...args} filter={c?.filter} />
          );
          break;
        case "numeric":
          c.filterRenderer = NumericFilter;
          break;
        default:
          break;
      }
      return c;
    });
  }, [columns]);

  const [anchorEl, setAnchorEl] = useState(null);
  const isCheckListOpen = Boolean(anchorEl);
  const popoverId = isCheckListOpen ? "simple-popover" : undefined;

  const handleOpenCheckList = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChecklistClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ ...containerStyle }}>
      <StyledAppBar>
        <div style={{ flex: 1 }} />
        {showSelector ? (
          <>
            <Button
              title="Edit Columns"
              variant="default"
              onClick={handleOpenCheckList}
            />
            <Popover
              id={popoverId}
              open={isCheckListOpen}
              anchorEl={anchorEl}
              onClose={handleChecklistClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Checklist />
            </Popover>
          </>
        ) : (
          <></>
        )}
      </StyledAppBar>
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
        filters={filters}
        onFiltersChange={setFilters}
      />
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
