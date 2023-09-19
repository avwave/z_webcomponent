import {
  Paper
} from "@mui/material";
import React from "react";

import {
  DataGridContext,
  actions
} from "../DataGrid/DataGridContext";

import { defaultColumns, defaultRows, generateRows } from "./gridData";
import { VirtuosoDataGrid as DataGrid2 } from "./index";

const DataGridStory = {
  component: DataGrid2,
  title: "DataGrid/DataGridV3",
  tags: ['autodocs'],
  parameters: {
    chromatic: { disable: true },

  }
};

export default DataGridStory;

const DefaultStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);
  React.useEffect(() => {
    dispatch({
      payload: { rows: args.rows, columns: args.columns },
      type: actions.LOAD_DATA,
    });
    dispatch({
      type: actions.SET_DONE_LOADING,
    });
  }, [args.columns, args.rows, dispatch]);

  return <Paper style={{height: '90vh'}}><DataGrid2 {...args} /></Paper>;
};

export const Default = DefaultStory.bind({});
Default.args = {
  hasDateRangeFilter: true,
  hasSearchFilter: true,
  rows: defaultRows,
  columns: defaultColumns,
  filterable: true,
  useUrlAsState: true,
};

export const alternateToolbarFilter = DefaultStory.bind({});
alternateToolbarFilter.args = {
  ...Default.args,
  alternateToolbarFilter: true,
};

export const LargeDataSetVirtualization = DefaultStory.bind({});
LargeDataSetVirtualization.args = {
  ...Default.args,
  rows: generateRows(500),
}