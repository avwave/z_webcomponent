import {
  Chip,
  List,
  ListItem,
  ListSubheader,
  Paper
} from "@mui/material";
import { isEmpty } from "lodash";
import React from "react";
import { withReactContext } from "storybook-react-context";
import DataGridProvider, {
  actions, DataGridContext
} from "../DataGrid/DataGridContext";
import { DataGrid2 } from "./DataGrid2";
import { columnData, rows } from "./gridData";

const DataGridStory = {
  component: DataGrid2,
  title: "DataGrid/DataGrid2/ColumnTypes",
  parameters: {
    chromatic: { disable: true },
    // storyshots: { disable: true },
  },
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

  return <Paper style={{ height: '100' }}><DataGrid2 {...args} /></Paper>;
};


export const Default = DefaultStory.bind({});
Default.args = {
  rows: [
    {
      id: 1,
      name: 'Alice',
      age: 20
    },
    {
      id: 2,
      name: 'Bob',
      age: 21
    },
    {
      id: 3,
      name: 'Charlie',
      age: 22
    }
  ],
  columns: [
    {
      key: "name",
      name: "Name",
    },
    {
      key: "age",
      name: "Age",
    },
  ]
}

export const Basic = DefaultStory.bind({});
Basic.args = {
  ...Default.args,
  columns:[
    {
      key: "name",
      name: "Basic name",
    }
  ]
}

export const CellRenderer = DefaultStory.bind({});
CellRenderer.args = {
  ...Default.args,
  columns:[
    {
      key: "name",
      name: "Custom name",
      cellRenderer: ({ row }) => <Chip label={`${row.name} ;${row.age}`} />,
    }
  ]
}

