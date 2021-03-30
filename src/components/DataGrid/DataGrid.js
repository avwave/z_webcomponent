import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactDataGrid from "react-data-grid";
import { AppBar, Toolbar } from "@material-ui/core";
import { Button } from "../Button";
import { Checklist } from "../CheckList";

import styled from "styled-components";
import CheckboxProvider, {
  actions,
  CheckboxContext,
} from "../CheckList/checklistContext";
import { status } from "../Checkbox/Checkbox";

const {
  DraggableHeader: { DraggableContainer },
} = require("react-data-grid-addons");

const StyledAppBar = styled(Toolbar)`
  && {
    background-color: #fff;
  }
`;

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
    let filterColumns = columns.slice();
    checkListState.items.forEach((checkItem) => {
      const idx = filterColumns.findIndex((col) => col.colId === checkItem.id);
      filterColumns[idx].width = checkItem.state === status.CHECKED ? null : -1;
      filterColumns[idx].hidden = checkItem.state !== status.CHECKED;
    });
    setColumns(filterColumns.slice());
    setColumns(filterColumns);

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

  return (
    <>
      <Checklist />

      <DraggableContainer onHeaderDrop={onHeaderDrop}>
        <ReactDataGrid
          toolbar={() => (
            <StyledAppBar>
              <div style={{ flex: 1 }} />
              <Button title="Edit Columns" variant="default" />
            </StyledAppBar>
          )}
          columns={columns}
          rowGetter={(i) => rows[i]}
          rowsCount={rows.length}
          enableCellSelect={true}
          onGridRowsUpdated={onGridRowsUpdated}
          onGridSort={(sortColumn, sortDirection) =>
            setRows(sortRows(rows, sortColumn, sortDirection))
          }
        />
      </DraggableContainer>
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
