import {
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListSubheader,
  Paper,
} from "@mui/material";
import { isEmpty } from "lodash";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { withReactContext } from "storybook-react-context";
import DataGridProvider, {
  actions,
  DataGridContext,
} from "../DataGrid/DataGridContext";
import { DataGrid2 } from "./DataGrid2";
import { columnData, rows } from "./gridData";

import {faker} from '@faker-js/faker'
import ReactJson from "react-json-view";
faker.seed(123);

const DataGridStory = {
  component: DataGrid2,
  title: "DataGrid/DataGrid2/ExpandingRow",
  parameters: {
    chromatic: { disable: true },
    storyshots: { disable: true },
  },
};

export default DataGridStory;

const DetailRow = ({ rowData }) => {
  return (
    <Card>
      <CardContent>
        <ReactJson src={rowData} ></ReactJson>
      </CardContent>
    </Card>
  );
};

const ExpanderRow = ({ ...args }) => {
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

  return (
    <Paper style={{ height: "80vh" }}>
      <DataGrid2
        {...args}
        tableComponents={{
          detailsRow: {
            content: DetailRow,
          },
        }}
      />
    </Paper>
  );
};

export const Default = ExpanderRow.bind({});
Default.args = {
  filterable: true,
  showSelector: true,
  rows: rows,
  columns: [
    {
      colId: "expander",
      key: "expander",
      name: "",
      expanderControl: true,
      width: 70,
    },
    ...columnData,
  ],

  gridProps: {},
};
