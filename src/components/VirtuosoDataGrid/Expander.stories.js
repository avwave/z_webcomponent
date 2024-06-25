import {
  Chip,
  List,
  ListItem,
  ListSubheader,
  Paper
} from "@mui/material";
import { isEmpty } from "lodash";
import React from "react";
import {
  DataGridContext,
  actions
} from "../DataGrid/DataGridContext";
import { columnData, rows } from "../DataGrid2/gridData";
import { VirtuosoDataGrid as DataGrid2 } from "./index";

const DataGridStory = {
  component: DataGrid2,
  title: "DataGrid/DataGridV3/ExpandingCell",
  parameters: {
    chromatic: { disable: true },
    // storyshots: { disable: true },
  },
};

export default DataGridStory;

const ExpanderCells = ({ ...args }) => {
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

  return <Paper style={{ height: '80vh' }}><DataGrid2 {...args} /></Paper>;
};

const PackageRenderer = ({ pack, key, tests }) => {
  return <><ListSubheader>{pack?.package?.label}</ListSubheader>
    {tests.map((test, tKey) => (
      <ListItem dense key={tKey}>
        {test?.test?.label}
      </ListItem>
    ))}
  </>
}

export const Default = ExpanderCells.bind({});
Default.args = {
  id: 'expandercells-default',
  filterable: true,
  showSelector: true,
  rows: rows,
  columns: [{
    colId: 'tests',
    key: 'tests',
    name: 'Expander Cell',
    resizable: true,
    minWidth: 250,
    cellRenderer({ row }) {
      return <div>
        {row?.tests?.length > 2 ? <Chip size="small" label={`${row?.tests?.length} tests`} /> :
          (row.tests ?? []).map((test, key) => <div key={key}>{test?.test?.label}<br /></div>)
        }
      </div>
    },
    tooltip({ row }) {
      return <div>
        {(row.tests ?? []).map((test, key) => <div key={key}>{test?.test?.label}<br /></div>)}
      </div>
    },
    expandRenderer({ row }) {
      const isRender = row.tests.length > 2
      const packages = isEmpty(row?.packages) ? [{ package: { label: "" } }] : row?.packages
      return isRender ? (
        <List>
          {packages.map((pack, key) => <PackageRenderer pack={pack} key={key} tests={row?.tests ?? []} />)}
        </List>
      ) : null
    }
  },
  ...columnData],

  gridProps: {},
};