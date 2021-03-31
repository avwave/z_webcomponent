import { Popover, Toolbar } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import ReactDataGrid from "react-data-grid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { Button } from "../Button";
import { status } from "../Checkbox/Checkbox";
import { Checklist } from "../CheckList";
import CheckboxProvider, {
  actions,
  CheckboxContext,
} from "../CheckList/checklistContext";
import {
  DraggableHeaderRenderer,
  DraggableHeaderRnderer,
} from "./DraggableHeaderRenderer";

const StyledAppBar = styled(Toolbar)`
  && {
    background-color: #fff;
  }
`;

function DataGrid({ columns: colData, rows, draggable, showSelector }) {
  const [columns, setColumns] = useState(colData);

  const [checkListState, checkListDispatch] = React.useContext(CheckboxContext);

  React.useEffect(() => {
    const defaultItems = colData.map((col) => {
      return {
        id: col.colId,
        title: col.name,
        state: col.hidden ? status.UNCHECKED : status.CHECKED,
      };
    });
    checkListDispatch({
      payload: { items: defaultItems },
      type: actions.LOAD_ITEMS,
    });
  }, [colData, checkListDispatch]);

  React.useEffect(() => {
    let copyColumns = colData;
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
  }, [checkListState]);

  const [[sortColumn, sortDirection], setSort] = useState(["", "NONE"]);

  const handleSort = useCallback((columnKey, direction) => {
    setSort([columnKey, direction]);
  }, []);

  const sortedRows = useMemo(() => {
    if (sortDirection === "NONE") return rows;
    let sortedRows = [...rows];
    sortedRows = sortedRows.sort((a, b) => a[sortColumn] - b[sortColumn]);
    return sortDirection === "DESC" ? sortedRows.reverse() : sortedRows;
  }, [rows, sortDirection, sortColumn]);

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
      return { ...c, headerRenderer: HeaderRenderer };
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
    <>
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
          columns={draggable ? draggableColumns : columns}
          rows={sortedRows}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          enableCellSelect={true}
          onSort={handleSort}
        />
      </DndProvider>
    </>
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
  columns: PropTypes.arrayOf(PropTypes.any),
  rows: PropTypes.arrayOf(PropTypes.any),
};
