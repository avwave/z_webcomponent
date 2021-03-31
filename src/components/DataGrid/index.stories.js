import { Chip } from "@material-ui/core";
import { DateTime } from "luxon";
import React from "react";
import { withReactContext } from "storybook-react-context";
import { DataGrid } from ".";
import { Button } from "../Button";

import { columnData, rows } from "./gridData";
import DataGridProvider, {
  dataGridReducer,
  DataGridContext,
  actions,
  initState,
} from "./DataGridContext";

const DataGridStory = {
  component: DataGrid,
  title: "DataGrid/DataGrid",
  decorators: [
    withReactContext({
      reducer: dataGridReducer,
      context: DataGridContext,
      initialState: { ...initState },
    }),
    (Story) => (
      <DataGridProvider>
        <Story />
      </DataGridProvider>
    ),
  ],
};

export default DataGridStory;

const DefaultStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);
  React.useEffect(() => {
    dispatch({
      payload: { rows: args.rows, columns: args.columns },
      type: actions.LOAD_DATA,
    });
  }, [args.columns, args.rows, dispatch]);

  return <DataGrid {...args} />;
};

export const Default = DefaultStory.bind({});
Default.args = {
  rows: rows,
  columns: columnData,
};

export const CellFormatter = DefaultStory.bind({});
const CellFormatting = ({ value }) => {
  return <Chip label={value.row[value.key]} />;
};
const applyDateColumn = [
  {
    key: "col5Type",
    colId: "col4",
    name: "Column4",
    formatter(props) {
      return <CellFormatting value={{ ...props, key: "col5Type" }} />;
    },
  },
];

CellFormatter.args = {
  ...Default.args,
  columns: applyDateColumn,
};

export const Reorderable = DefaultStory.bind({});
Reorderable.args = {
  ...Default.args,
  draggable: true,
  columns: columnData,
};

export const ClientSortable = DefaultStory.bind({});
ClientSortable.args = {
  ...Default.args,
  columns: columnData.map((cols) => {
    return { ...cols, sortable: true };
  }),
};

export const ColumnDisplaySelection = DefaultStory.bind({});
ColumnDisplaySelection.args = {
  ...Default.args,
  showSelector: true,
  filterable: false,
};

const ServerFilterSortStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);
  React.useEffect(() => {
    dispatch({
      payload: { rows: args.rows, columns: args.columns },
      type: actions.LOAD_DATA,
    });
  }, [args.columns, args.rows]);

  
  React.useEffect(() => {
    if (state.sortColumn === null || state.sortDirection === null) {
      console.log("init state")
      return
    }
    if (state.sortDirection === "NONE") return state.rows;

    let sortedRows = state.rows;
    console.log("🚀 ~ file: index.stories.js ~ line 109 ~ React.useEffect ~ state", state)
    

    sortedRows = sortedRows.sort((a, b) =>
      (a[state.sortColumn]).toString().localeCompare(b[state.sortColumn].toString())
    )

    sortedRows = state.sortDirection === "DESC" ? sortedRows.reverse() : sortedRows;
    
    dispatch({
      payload: { rows: sortedRows },
      type: actions.LOAD_ROWS,
    });
  }, [state.sortColumn, state.sortDirection])

  return <DataGrid {...args} />;
};
export const ServerFilterSort = ServerFilterSortStory.bind({});
ServerFilterSort.args = {
  ...Default.args,
  showSelector: true,
  filterable: true,
  columns: columnData.map((cols) => {
    return { ...cols, sortable: true };
  }),
};
