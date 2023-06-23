import {
  Chip,
  Paper,
  Typography
} from "@mui/material";
import React from "react";
import {
  DataGridContext,
  actions
} from "../DataGrid/DataGridContext";
import { VirtuosoDataGrid as DataGrid2 } from "./index";
import ReactJson from "react-json-view";
import { generateRows } from "./gridData";

const DataGridStory = {
  component: DataGrid2,
  title: "DataGrid/DataGridV3/ColumnProps",
  parameters: {
    // chromatic: { disable: true },
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
  rows: generateRows(1),
  columns: [
    {
      key: "string",
      name: "String",
      dataType: "text",
    }
  ]
}

export const NumberCell = DefaultStory.bind({});
NumberCell.args = {
  ...Default.args,
  columns:[
    {
      key: "number",
      name: "number",
      dataType: "number",
    },
    {
      key: "float",
      name: "float",
      dataType: "float",
    },
    {
      key: "float",
      name: "currency",
      dataType: "currency",
    },
    {
      key: "percent",
      name: "percent",
      dataType: "percent",
    }
  ]
}

export const StandardDateCell = DefaultStory.bind({});
StandardDateCell.args = {
  ...Default.args,
  columns:[
    {
      key: "date",
      name: "date",
      dataType: "date",
      dateOptions:{
        format: "LL LTS"
      }
    },
  ]
}

export const ShortDateCell = DefaultStory.bind({});
ShortDateCell.args = {
  ...Default.args,
  columns: [
    {
      key: "date",
      name: "date",
      dataType: "date",
      dateOptions: {
        format: "MM/DD/YYYY"
      }
    },
  ]
}

export const RelativeDateCell = DefaultStory.bind({});
RelativeDateCell.args = {
  ...Default.args,
  columns: [
    {
      key: "date",
      name: "date",
      dataType: "date",
      dateOptions: {
        relative: true
      }
    },
  ]
}

export const ReactAsRowCell = DefaultStory.bind({});
ReactAsRowCell.args = {
  ...Default.args,
  columns: [
    {
      key: "react",
      name: "react",
      dataType: "react",
    },
  ]
}

export const ReactAsRenderedCell = DefaultStory.bind({});
ReactAsRenderedCell.args = {
  ...Default.args,
  columns: [
    {
      key: "string",
      name: "string",
      dataType: "text",
      cellRenderer ({row}) {
        return <Chip label={row.string} />
      }
    }
  ]
}

export const NullCell = DefaultStory.bind({});
NullCell.args = {
  ...Default.args,
  rows: [
    {
      id: 1,
      name: null,
      age: undefined
    }
  ]
}
