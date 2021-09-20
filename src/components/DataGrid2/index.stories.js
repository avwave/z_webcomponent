import {
  Button,
  ButtonGroup,
  Chip,
  Grid,
  ListItem,
  Paper,
  Typography,
} from "@material-ui/core";
import { Row } from "react-data-grid";
import React, { useState } from "react";
import { withReactContext } from "storybook-react-context";

import isEmpty from "lodash.isempty";

import { columnData, rows } from "./gridData";
import DataGridProvider, {
  dataGridReducer,
  DataGridContext,
  actions,
  initState,
} from "../DataGrid/DataGridContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SelectColumn } from "react-data-grid";

import { Menu as ContextMenu, Item as ContextItem } from "react-contexify";
import { action } from "@storybook/addon-actions";
import { DataGrid2 } from "./DataGrid2";
import ReactJson from "react-json-view";

const DataGridStory = {
  component: DataGrid2,
  title: "DataGrid/DataGrid2",
  parameters: {
    chromatic: { disable: true },
    storyshots: { disable: true },
  },
  decorators: [
    withReactContext(),
    (Story) => (
      <DndProvider backend={HTML5Backend}>
        <DataGridProvider>
          <Story />
        </DataGridProvider>
      </DndProvider>
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
    dispatch({
      type: actions.SET_DONE_LOADING,
    });
  }, [args.columns, args.rows, dispatch]);

  return <Paper style={{height: '80vh'}}><DataGrid2 {...args} /></Paper>;
};

export const Default = DefaultStory.bind({});
Default.args = {
  rows: rows,
  columns: columnData,
  gridProps: {
    filterWidth: 200,
  },
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
export const Blank = DefaultStory.bind({});
Blank.args = {
  ...Default.args,
  rows:[],
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
  const [sentFilters, setSentFilters] = useState();

  React.useEffect(() => {
      dispatch({
        payload: { columns: args.columns },
        type: actions.LOAD_COLUMNS,
      });

  }, [args.columns]);

  React.useEffect(() => {
    dispatch({
      payload: { rows: args.rows},
      type: actions.LOAD_ROWS,
    });
  }, [args.rows]);

  const handleSort = React.useCallback(
    (sortColumn, sortDirection) => {
      // if (sortColumn === null || sortDirection === null) {
      //   return;
      // }
      // if (sortDirection === "NONE") {
      //   return state.rows;
      // }
  
      let sortedRows = state.rows;
      sortedRows = sortedRows.sort((a, b) =>
        a[sortColumn]
          .toString()
          .localeCompare(b[sortColumn].toString())
      );
  
      sortedRows =
        sortDirection === "DESC" ? sortedRows.reverse() : sortedRows;
  
      dispatch({
        payload: { rows: [...sortedRows] },
        type: actions.LOAD_ROWS,
      });
    },
    [dispatch, state.rows],
  );

  React.useEffect(() => {
    const searchKeys = isEmpty(state.filterColumn)
      ? []
      : Object.keys(state.filterColumn);

    let filteredRows = args.rows;
    searchKeys.forEach((searchKey) => {
      filteredRows = filteredRows.filter((row) => {
        if(searchKey === 'search') {
          return true
        }
        const searchItem = row[searchKey]

        switch (typeof state.filterColumn[searchKey]) {
          case "boolean":
            return !isEmpty(searchItem) === state.filterColumn[searchKey];
          case "object":
            return state.filterColumn[searchKey] === null;
          case "string":
            if (isEmpty(searchItem)) {
              return true
            }
            const ret = searchItem.toLowerCase().includes(state.filterColumn[searchKey].toString().toLowerCase());
            return ret
          default:
            return true
            
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

  React.useEffect(() => {
    setSentFilters(state.filterColumn)
  }, [state.filterColumn])

  return <Paper style={{height: '80vh'}}>
    <ReactJson src={sentFilters} />
    <DataGrid2 {...args} 
      onSort={(col, dir) => {
        console.log("📢[index.stories.js:211]: ", col, dir);
        handleSort(col, dir)
      }}
    />
    
  </Paper>;
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
    <Paper style={{height: '80vh'}}>
    <DataGrid2
      {...args}
      gridProps={{
        selectedRows: selectedRowIds,
        onSelectedRowsChange: (rows) => {
          console.log("📢[index.stories.js:231]: ", rows);
          setSelectedRowIds(rows);
        },
        rowKeyGetter: (row) => {
          return row.id;
        },
      }}
    />
    <pre>{JSON.stringify(selectedRowIds, null, 2)}</pre>
    </Paper>
  );
};

export const Selectable = SelectableStory.bind({});
Selectable.args = {
  ...Default.args,
  rows: rows,
  columns: [SelectColumn, ...columnData],
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
      <Paper style={{height: '80vh'}}>
        <DataGrid2 {...args} />
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
      <Paper style={{height: '80vh'}}>
        <DataGrid2 {...args} />
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
  const tableRef = React.useRef(null);

  const resetScroll = React.useCallback(
    () => {
      if (tableRef.current) {
        tableRef.current.scrollTop = 0;
      }
    },
    [],
  );
  
  const simulateLoading = React.useCallback(
    async (params) => {
      console.log("📢[index.stories.js:406]: ", params);
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

  React.useEffect(() => {
    simulateLoading()
  }, []);

  const [selectedRowIds, setSelectedRowIds] = useState(() => new Set());

  return (
    <Grid container>
      <Grid item xs={12}>
      <Paper style={{height: '80vh'}}>
        <DataGrid2 {...args} 
          onLoadMore={(params)=>simulateLoading(params)}
          ref={tableRef}
          pageSize={20}
          pageOffset={0}
          leftAccessory={ () => (
            <ButtonGroup>
              <Button onClick={()=>resetScroll()}>resetscroll</Button>
            </ButtonGroup>
          )}
          gridProps={{
            selectedRows: selectedRowIds,
            onSelectedRowsChange: (rows) => {
              console.log("📢[index.stories.js:231]: ", rows);
              setSelectedRowIds(rows);
            },
            rowKeyGetter: (row) => {
              return row.id;
            },
          }}
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
  totalCount: 300,
  centerAccessory: () => <Typography variant="h6">Heading</Typography>,
  columns: [SelectColumn, ...columnData],
};