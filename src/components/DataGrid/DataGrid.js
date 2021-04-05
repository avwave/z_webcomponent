import { Popover, Toolbar } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import ReactDataGrid from "react-data-grid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { GridBox } from ".";
import { Button } from "../Button";
import { status } from "../Checkbox/Checkbox";
import { Checklist } from "../CheckList";
import CheckboxProvider, {
  actions as checkboxActions,
  CheckboxContext,
} from "../CheckList/checklistContext";
import { actions as dataGridActions, DataGridContext } from "./DataGridContext";
import {
  DraggableHeaderRenderer,
  DraggableHeaderRnderer,
} from "./DraggableHeaderRenderer";
import { TextFilterRenderer } from "./FilterRenderer";


const StyledAppBar = styled(Toolbar)`
  && {
    background-color: #fff;
  }
`;

function DataGrid({ draggable, showSelector, filterable, style, containerStyle, gridProps }) {
  const [checkListState, checkListDispatch] = React.useContext(CheckboxContext);
  const [dataGridState, dataGridDispatch] = React.useContext(DataGridContext)
  
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

  const handleSort = useCallback((sortColumn, sortDirection) => {
    dataGridDispatch({
      type: dataGridActions.SORT_COLUMN,
      payload: {
        sortColumn, sortDirection
      }
    })
    setSort([sortColumn, sortDirection]);
  }, [dataGridDispatch]);


  React.useEffect(() => {
    dataGridDispatch({
      type: dataGridActions.FILTER_COLUMN,
      payload: {
        filterColumn: filters,
      },
    });
  }, [dataGridDispatch, filters])
  

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
      c.formatter = (props) => {
        return (
          <GridBox align={c.align ?? "center"}>
            {c.cellRenderer ? c.cellRenderer(props) : props.row[props.column.key]}
          </GridBox>
        );
      }
      switch (c.filter) {
        case "text":
          c = {
            ...c,
            headerRenderer: HeaderRenderer,
            filterRenderer: TextFilterRenderer
          };
          break;

        default:
          c = {
            ...c,
            headerRenderer: HeaderRenderer,
          };

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
    <div style={{...containerStyle}}>
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
      <DndProvider backend={HTML5Backend}>
        <ReactDataGrid
          {...gridProps}
          style={{...style}}
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
      </DndProvider>
    </div>
  );
}
  

export default function DGWrapper(props) {
  return (
    <CheckboxProvider>
      <DataGrid {...props} />
    </CheckboxProvider>
  );
}
DataGrid.propTypes = {
  draggable: PropTypes.bool,
  showSelector: PropTypes.bool,
  filterable: PropTypes.bool,
};
