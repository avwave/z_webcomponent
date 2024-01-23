import {
  Button,
  Paper,
  Typography
} from "@mui/material";
import React, { useCallback, useState } from "react";

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

const AddDynamicColumnsStory = ({ ...args }) => {
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

  const [dynColId, setDynColId] = useState(0);
  const addDynColumn = useCallback(
    async () => {
      const newCol = {
        key: `dynCol${dynColId}`,
        name: `DynCol${dynColId}`,
        cellRenderer(props) {
          <>dyncol</>
        }
      }
      dispatch({
        payload: { columns: [...state.columns, newCol] },
        type: actions.LOAD_DATA,
      });
      dispatch({
        type: actions.SET_DONE_LOADING,
      });
      setDynColId(dynColId + 1)
      return null
    }, [dispatch, dynColId, state.columns]
  );

  return (
    <Paper style={{height: '90vh'}}>
      <Button onClick={() => {
        addDynColumn()
      }
      }>Add Column</Button>
      <DataGrid2 {...args} />
    </Paper>
  );
}

export const AddDynamicColumns = AddDynamicColumnsStory.bind({});
AddDynamicColumns.args = {
  ...Default.args,
  columns: [
    {
      key: "id",
      name: "ID",
    }
  ]
}

export const ToolbarAccessory = DefaultStory.bind({});
ToolbarAccessory.args = {
  ...Default.args,
  filterable: false,
  showSelector: true,
  replaceFilterWithComponent: <Typography variant="h6">Heading</Typography>,

};