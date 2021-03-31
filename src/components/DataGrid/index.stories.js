import { Chip } from "@material-ui/core";
import { DateTime } from "luxon";
import React from "react";
import { DataGrid } from ".";
import { Button } from "../Button";

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
const CellFormatting = ( {value} ) => {
  return <Chip label={value.row[value.key]}/>;
};
const applyDateColumn = [
  {
    key: "col5Type",
    colId: "col4",
    name: "Column4",
    formatter(props){
      return <CellFormatting value={{...props, key:"col5Type"}}/>
    } 
  },
];

CellFormatter.args = {
  ...Default.args,
  columns: applyDateColumn,
};


export const Reorderable = DefaultStory.bind({})
Reorderable.args = {
  ...Default.args,
  draggable: true,
  columns: columnData
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
  ...Default.args,
  showSelector: true
}
