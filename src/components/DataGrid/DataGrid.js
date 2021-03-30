import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactDataGrid from "react-data-grid";
const {
  DraggableHeader: { DraggableContainer },
} = require("react-data-grid-addons");

export default function DataGrid({ columns: colData, rows:rowData }) {
  const [columns, setColumns] = useState(colData);

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
    <DraggableContainer onHeaderDrop={onHeaderDrop}>
      <ReactDataGrid
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
  );
}

DataGrid.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.any),
  rows: PropTypes.arrayOf(PropTypes.any),
};
