import { DateTime } from "luxon";
import React from "react";
import { DataGrid } from ".";

import { columnData, rows } from "./gridData";

const DataGridStory = {
  component: DataGrid,
  title: "DataGrid/DataGrid",
};

export default DataGridStory;

const DefaultStory = ({ ...args }) => {
  return <DataGrid {...args} />;
};

export const Default = DefaultStory.bind({});
Default.args = {
  columnTitle: "ColTitle",
  columnSubtitle: "ColSubtitle",
  rows: rows,
  columns: columnData
};


export const CellFormatter = DefaultStory.bind({});
const dateFormatter = ({value}) => {
  return <div>{DateTime.fromISO(value).toLocaleString()}</div>
}
const applyDateColumn = [
  {
    key: "col4Type",
    colId: "col4",
    name: "Column4",
    formatter: dateFormatter,
  },
];

CellFormatter.args = {
  ...Default.args,
  columns: applyDateColumn,
};


export const Reorderable = DefaultStory.bind({})
Reorderable.args = {
  ...Default.args,
  columns: columnData.map((cols) => {
    return { ...cols, draggable: true };
  })
};

export const Sortable = DefaultStory.bind({});
Sortable.args = {
  ...Default.args,
  columns: columnData.map((cols) => {
    return { ...cols, sortable: true };
  }),
};


export const ColumnDisplaySelection = DefaultStory.bind({})
ColumnDisplaySelection.args = {
  ...Default.args
}
