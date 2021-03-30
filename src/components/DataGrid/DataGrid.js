import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import ReactDataGrid from "react-data-grid";
import { AppBar, Popover, Toolbar } from "@material-ui/core";
import { Button } from "../Button";
import { Checklist } from "../CheckList";

import styled from "styled-components";
import CheckboxProvider, {
  actions,
  CheckboxContext,
} from "../CheckList/checklistContext";
import { status } from "../Checkbox/Checkbox";

const StyledAppBar = styled(Toolbar)`
  && {
    background-color: #fff;
  }
`;

function useCombinedRefs(...refs) {
  return useCallback((handle) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(handle);
      } else if (ref !== null) {
        ref.current = handle;
      }
    }
  }, refs);
}

function DataGrid({ columns: colData, rows: rowData }) {
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

  const [rows, setRows] = useState(rowData);

  const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    const s = rows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      s[i] = { ...s[i], ...updated };
    }
    setRows(s);
  };

  const sortRows = (initialRows, sortColumn, sortDirection) => (rows) => {
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer);
  };

  const onHeaderDrop = (source, target) => {
    var columnsCopy = columns.slice();
    const columnSourceIndex = columns.findIndex((i) => i.key === source);
    const columnTargetIndex = columns.findIndex((i) => i.key === target);

    columnsCopy.splice(
      columnTargetIndex,
      0,
      columnsCopy.splice(columnSourceIndex, 1)[0]
    );

    setColumns(columnsCopy.splice());
    setColumns(columnsCopy);
  };

  // const draggableColumns = useMemo(() => {
  //   function HeaderRenderer(props) {
  //     return
  //   }
  // })

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
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Checklist />
        </Popover>
      </StyledAppBar>

      <ReactDataGrid
        columns={columns}
        rows={rows}
        enableCellSelect={true}
        onGridRowsUpdated={onGridRowsUpdated}
        onGridSort={(sortColumn, sortDirection) =>
          setRows(sortRows(rows, sortColumn, sortDirection))
        }
      />
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
