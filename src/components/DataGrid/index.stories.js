import {
  Button,
  ButtonGroup,
  Chip,
  Grid,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { Row } from "react-data-grid";
import React, { useState } from "react";

import { DataGrid } from ".";
import isEmpty from "lodash.isempty";

import { columnData, rows } from "./gridData";
import DataGridProvider, {
  dataGridReducer,
  DataGridContext,
  actions,
  initState,
} from "./DataGridContext";
import { SelectColumn } from "react-data-grid";

import { Menu as ContextMenu, Item as ContextItem } from "react-contexify";
import { action } from "@storybook/addon-actions";

const DataGridStory = {
  component: DataGrid,
  title: "DataGrid/DataGrid",

};

export default DataGridStory;

const DefaultStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);
  React.useEffect(() => {
    dispatch({
      type: actions.SET_LOADING,
    });
    dispatch({
      payload: { rows: args.rows, columns: args.columns },
      type: actions.LOAD_DATA,
    });
    dispatch({
      type: actions.SET_DONE_LOADING,
    });
  }, [args.columns, args.rows, dispatch]);

  return <Paper><DataGrid {...args} /></Paper>;
};

export const Default = DefaultStory.bind({});
Default.args = {
  rows: rows,
  columns: columnData,
  containerStyle: {
    maxHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  style: { flex: "1 1 auto" },
  gridProps: {},
  totalCount: 10000,
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
    align: "flex-start",
    cellRenderer(props) {
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

export const GridProps = DefaultStory.bind({});
GridProps.args = {
  ...Default.args,
  draggable: true,
  columns: columnData,
  gridProps: {
    rowHeight: 60,
  },
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
    async function fetchData() {
      dispatch({
        payload: { rows: args.rows, columns: args.columns },
        type: actions.LOAD_DATA,
      });
    }

    // dispatch({
    //   type: actions.SET_LOADING,
    // });

    const timer = setTimeout(() => {
      fetchData();
    }, 100);

    return () => clearTimeout(timer);
  }, [args.columns, args.rows]);

  React.useEffect(() => {
    if (state.sortColumn === null || state.sortDirection === null) {
      return;
    }
    if (state.sortDirection === "NONE") return state.rows;

    let sortedRows = state.rows;
    sortedRows = sortedRows.sort((a, b) =>
      a[state.sortColumn]
        .toString()
        .localeCompare(b[state.sortColumn].toString())
    );

    sortedRows =
      state.sortDirection === "DESC" ? sortedRows.reverse() : sortedRows;

    dispatch({
      payload: { rows: sortedRows },
      type: actions.LOAD_ROWS,
    });
  }, [state.sortColumn, state.sortDirection]);

  React.useEffect(() => {
    const searchKeys = isEmpty(state.filterColumn)
      ? []
      : Object.keys(state.filterColumn);

    let filteredRows = args.rows;
    searchKeys.forEach((searchKey) => {
      filteredRows = filteredRows.filter((row) => {
        switch (typeof state.filterColumn[searchKey]) {
          case "boolean":
            return !isEmpty(row[searchKey]) === state.filterColumn[searchKey];
          case "object":
            return state.filterColumn[searchKey] === null;
          default:
            return row[searchKey]
              .toLowerCase()
              .includes(state.filterColumn[searchKey].toString().toLowerCase());
        }
      });
      console.log(
        `Filtering {${searchKey} ${state.filterColumn[searchKey]}`,
        filteredRows
      );
    });
    dispatch({
      payload: { rows: filteredRows },
      type: actions.LOAD_ROWS,
    });
  }, [state.filterColumn]);

  return <Paper><DataGrid {...args} /></Paper>;
};
export const ServerFilterSort = ServerFilterSortStory.bind({});
ServerFilterSort.args = {
  ...Default.args,
  showSelector: true,
  filterable: true,
};

const SelectableStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);
  const [selectedRowIds, setSelectedRowIds] = useState(() => new Set());

  React.useEffect(() => {
    dispatch({
      payload: { rows: args.rows, columns: args.columns },
      type: actions.LOAD_DATA,
    });
  }, [args.columns, args.rows, dispatch]);

  return (
    <Paper>
    <DataGrid
      {...args}
      gridProps={{
        selectedRows: selectedRowIds,
        onSelectedRowsChange: (rows) => {
          console.log("📢[index.stories.js:226]: ", rows);
          setSelectedRowIds(rows);
        },
        rowKeyGetter: (row) => {
          return row.id;
        },
      }}
    />
    </Paper>
  );
};

export const Selectable = SelectableStory.bind({});
Selectable.args = {
  rows: rows,
  columns: [SelectColumn, ...columnData],
  containerStyle: {
    maxHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  style: { flex: "1 1 auto" },
};

function displayId({ props: { row } }) {
  alert(`selected row with id: ${row.id}`);
}
function displayItem({ props: { row } }) {
  alert(`selected row with: ${JSON.stringify(row, null, 2)}`);
}

function copyRow({ props: { row } }) {
  const rowcsv = Object.entries(row)
    .map(([k, v]) => {
      return `"${v}"`;
    })
    .join(",");
  const dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.setAttribute("value", rowcsv);
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
  alert(`copied to clipboard`);
}

export const DemoContextMenu = DefaultStory.bind({});
DemoContextMenu.args = {
  ...Default.args,
  contextMenu: {
    menuId: "CONTEXT_MENU_ID",
    contextItems(props) {
      return (
        <ContextMenu id={"CONTEXT_MENU_ID"}>
          <ContextItem onClick={displayId}>
            <ListItem>Display ID</ListItem>
          </ContextItem>
          <ContextItem onClick={displayItem}>
            <ListItem>Display Info</ListItem>
          </ContextItem>
          <ContextItem onClick={copyRow}>
            <ListItem>Copy row to clipboard</ListItem>
          </ContextItem>
        </ContextMenu>
      );
    },
  },
};

export const ToolbarAccessory = DefaultStory.bind({});
ToolbarAccessory.args = {
  ...Default.args,
  filterable: true,
  showSelector: true,
  rightAccessory: () => (
    <ButtonGroup>
      <Button onClick={action("Right Button onClick")}>Right</Button>
    </ButtonGroup>
  ),
  leftAccessory: () => (
    <ButtonGroup>
      <Button onClick={action("Left Button onClick")}>Left</Button>
    </ButtonGroup>
  ),

  centerAccessory: () => <Typography variant="h6">Heading</Typography>,
};

const RedrawBugStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);
  React.useEffect(() => {
    dispatch({
      payload: { rows: args.rows, columns: args.columns },
      type: actions.LOAD_DATA,
    });
  }, [args.columns, args.rows, dispatch]);

  return (
    <Grid container>
      <Grid item xs={12}>
      <Paper style={{ display: "flex", flexDirection: "column", height: "70vh" }}>
        <DataGrid {...args} />
      </Paper>
      </Grid>
    </Grid>
  );
};

export const RedrawBug = RedrawBugStory.bind({});
RedrawBug.args = {
  rows: rows,
  columns: columnData,
  containerStyle: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
  },
  style: { flex: "1 1 auto" },
  gridProps: {},
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const LoaderStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);

  const simulateLoading = React.useCallback(
    async () => {
      dispatch({
        type: actions.SET_LOADING,
      });
      await sleep(2000)
      dispatch({
        type: actions.SET_DONE_LOADING,
      });
    },
    [dispatch],
  );

  React.useEffect(() => {
    dispatch({
      payload: { rows: args.rows, columns: args.columns },
      type: actions.LOAD_DATA,
    });
  }, [args.columns, args.rows, dispatch]);

  return (
    <Grid container>
      <Grid item xs={12}>
      <Paper style={{ display: "flex", flexDirection: "column", height: "70vh" }}>
        <DataGrid {...args} />
        <Button onClick={()=>simulateLoading()}>Simulate Loading</Button>
      </Paper>
      </Grid>
    </Grid>
  );
};

export const Loader = LoaderStory.bind({});
Loader.args = {
  ...Default.args,
  filterable: true,
  showSelector: true,
  leftAccessory: () => (
    <ButtonGroup>
      <Button onClick={action("Left Button onClick")}>Left</Button>
    </ButtonGroup>
  ),

  centerAccessory: () => <Typography variant="h6">Heading</Typography>,
};

const InfiniteLoaderStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);

  const aggregateRows = React.useRef([]);
  
  const tableRef = React.useRef()

  const resetScroll = React.useCallback(
    () => {
      if (tableRef.current) {
        tableRef.current.scrollTop = 0;
      }
    },
    [],
  );

  const simulateLoading = React.useCallback(
    async () => {
      dispatch({
        type: actions.SET_LOADING,
      });
      const mrows = aggregateRows.current.map((r,i) => {
        return {
          ...r,
          id: i
        }
      })

      const arows = args.rows.map((r,i) => {
        return {
          ...r,
          id: i+mrows.length
        }
      })

      const rs = [...mrows, ...arows]
      console.log("📢[index.stories.js:404rsrsrs]: ", mrows, arows, rs);

      aggregateRows.current = rs

      dispatch({
        payload: { rows: rs },
        type: actions.LOAD_ROWS,
      });
      dispatch({
        type: actions.SET_DONE_LOADING,
      });
    },
    [aggregateRows, args.rows, dispatch],
  );

  
  React.useEffect(() => {
    dispatch({
      payload: { columns: args.columns, rows: args.rows },
      type: actions.LOAD_DATA,
    });
  }, [args.columns, args.rows, dispatch]);


  return (
    <Grid container>
      <Grid item xs={12}>
      <Paper style={{ display: "flex", flexDirection: "column", height: "70vh" }}>
        <DataGrid {...args} 
          onLoadMore={()=>simulateLoading()}
          ref={tableRef}
          leftAccessory={ () => (
            <ButtonGroup>
              <Button onClick={()=>resetScroll()}>Left</Button>
            </ButtonGroup>
          )}
        />
      </Paper>
      </Grid>
    </Grid>
  );
};

export const InfiniteLoader = InfiniteLoaderStory.bind({});
InfiniteLoader.args = {
  ...Default.args,
  filterable: true,
  showSelector: true,
  totalCount: 10000,
  centerAccessory: () => <Typography variant="h6">Heading</Typography>,
};

export const Expandable = DefaultStory.bind({});
Expandable.args = {
  ...Default.args,
  draggable: true,
  columns: [
    {
      key: "colArray",
      colId: "colArray",
      name: "array",
      sortable: false,
      resizable: true,
      minWidth: 150,
      expandRenderer({row}) {
        return row.colArray.length < 1 ? <ul>
          {row.colArray.map((d, key)=><li key={key}>{d.value}</li>)}
        </ul>: null
      },
      cellRenderer({row}) {
        return <span>{row.colArray.length}</span>
      },
      align: "flex-start",
    },
    ...columnData
  ],
};