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
import { withReactContext } from "storybook-react-context";

import isEmpty from "lodash.isempty";

import { columnData, rows } from "../DataGrid2/gridData";
import DataGridProvider, {
  dataGridReducer,
  DataGridContext,
  actions,
  initState,
} from "../DataGrid/DataGridContext";
import { SelectColumn } from "react-data-grid";

import { Menu as ContextMenu, Item as ContextItem } from "react-contexify";
import { action } from "@storybook/addon-actions";
import { VirtuosoDataGrid as DataGrid2 } from "./index";
import ReactJson from "react-json-view";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faColumns } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";

const DataGridStory = {
  component: DataGrid2,
  title: "DataGrid/DataGridV3",
  parameters: {
    chromatic: { disable: true },
    // storyshots: { disable: true },
    docs: {
      // page: Usage
      source: {
        type: 'code'
      }
    }
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

  return <Paper ><DataGrid2 {...args} /></Paper>;
};

export const Default = DefaultStory.bind({});
Default.args = {
  hasDateRangeFilter: true,
  hasSearchFilter: true,
  rows: rows,
  columns: columnData,
  gridProps: {
    filterWidth: 200,
  },
  filterable: true,
  useUrlAsState: true
};

const LoadingStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);
  React.useEffect(() => {
    dispatch({
      type: actions.SET_LOADING,
    });
    dispatch({
      payload: { rows: args.rows, columns: args.columns },
      type: actions.LOAD_DATA,
    });
  }, [args.columns, args.rows, dispatch]);

  return <Paper style={{ height: '80vh' }}>
    {
      state?.loading ? 'loading': 'finished'
    }
    <DataGrid2 {...args} />
    </Paper>;
};

export const Loading = LoadingStory.bind({});
Loading.args = {
  ...Default.args,
}

export const Basic = DefaultStory.bind({});
Basic.args = {
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

export const CustomColumnDisplay = DefaultStory.bind({});
CustomColumnDisplay.args = {
  ...Default.args,
  customColumnDisplay: {
    component: Button,
    props: {
      variant: 'contained',
      children: <FontAwesomeIcon icon={faColumns} />
    }
  },
  showSelector: true,
}

const SelectableStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  React.useEffect(() => {
    dispatch({
      payload: { rows: args.rows, columns: args.columns },
      type: actions.LOAD_DATA,
    });
  }, [args.columns, args.rows, dispatch]);

  return (
    <Paper style={{ height: '80vh' }}>
      <pre>{JSON.stringify(selectedRowIds, null, 2)}</pre>
      <Button onClick={() => setSelectedRowIds([])}>Clear</Button>
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
    </Paper>
  );
};

export const ConditionalSelector = SelectableStory.bind({});
ConditionalSelector.args = {
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
      key: "select-row",
      name: "",
      sortable: false,
      hidden:true,
      selectable({ row }) {
        return row.id !== '2'
      }
    },
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

export const ToolbarSearchPlaceholder = DefaultStory.bind({});
ToolbarSearchPlaceholder.args = {
  hasDateRangeFilter: true,
  hasSearchFilter: true,
  searchPlaceholder: 'Type here to search',
  rows: rows,
  columns: columnData,
  gridProps: {
    filterWidth: 200,
  },
  filterable: true
};

export const CellFormatter = DefaultStory.bind({});
const CellFormatting = ({ value }) => {
  return <Chip label={value.row[value.key]} />;
};
const applyDateColumn = [
  {
    key: "col_customheader",
    colId: "col4",
    name: "Column4",
    align: "flex-start",
    cellRenderer(props) {
      return <CellFormatting value={{ ...props, key: "col_truncate" }} />;
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
  rows: [],
  draggable: true,
  columns: columnData,
  gridProps:{
    emptyRowsRenderer: () => (
      <Box textAlign="center" p="1rem" color="grey">
        No matching records found
      </Box>
    ),
  }
};

export const NoHeaderElements = DefaultStory.bind({});
NoHeaderElements.args = {
  ...Default.args,
  hasDateRangeFilter: false,
  hasSearchFilter: false,
  filterable: false
}

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
  filterable: true,
};

const ServerFilterStory = ({ ...args }) => {
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
      payload: { rows: args.rows },
      type: actions.LOAD_ROWS,
    });
  }, [args.rows]);

  React.useEffect(() => {
    console.log('vgrid.js (252) recieved filter command', state?.filterColumn)
    const searchKeys = isEmpty(state.filterColumn)
      ? []
      : Object.keys(state.filterColumn);

    let filteredRows = args.rows;
    searchKeys.forEach((searchKey) => {
      filteredRows = filteredRows.filter((row) => {
        if (searchKey === 'search') {
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
            // const ret = searchItem.toLowerCase().includes(state.filterColumn[searchKey].toString().toLowerCase());
            return true
          default:
            return true

        }
      });
    });
    dispatch({
      payload: { rows: filteredRows },
      type: actions.LOAD_ROWS,
    });
  }, [state.filterColumn]);

  React.useEffect(() => {
    setSentFilters(state.filterColumn)
  }, [state.filterColumn])

  return <>
    <ReactJson src={sentFilters} />
    <DataGrid2 {...args} />
  </>;
};
export const ServerFilter = ServerFilterStory.bind({});
ServerFilter.args = {
  ...Default.args,
  useUrlAsState: true,
  showSelector: true,
  filterable: true,
};
const ServerSortStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);

  React.useEffect(() => {
    dispatch({
      payload: { columns: args.columns },
      type: actions.LOAD_COLUMNS,
    });

  }, [args.columns]);

  React.useEffect(() => {
    dispatch({
      payload: { rows: args.rows },
      type: actions.LOAD_ROWS,
    });
  }, [args.rows]);

  const handleSort = React.useCallback(
    (sortColumn, sortDirection) => {
      // sortColumn and sortDirection can be sent to the server.  sortDirection is either 'ASC' or 'DESC'
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

  return <DataGrid2 {...args}
    onSort={(col, dir) => {
        
      handleSort(col, dir)
    }}
  />

};
export const ServerSort = ServerSortStory.bind({});
ServerSort.args = {
  ...Default.args,
  showSelector: true,
  filterable: true,
};

export const Selectable = SelectableStory.bind({});
Selectable.args = {
  ...Default.args,
  rows: rows,
  columns: [
    {
      key: "select-row",
      name: "",
      sortable: false,
      selectable: ({ row }) => {
        return true
      }
    },
    ...columnData],
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
        <Paper style={{ height: '80vh' }}>
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
        <Paper style={{ height: '80vh' }}>
          <DataGrid2 {...args} />
          <Button onClick={() => simulateLoading()}>Simulate Loading</Button>
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

  const [allRows, setAllRows] = useState([]);

  const waitLoading = React.useCallback(
    (content, delay) => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(content);
        }, delay);
      })
    },
    [],
  );

  const simulateLoading = React.useCallback(
    async () => {
      dispatch({
        type: actions.SET_LOADING,
      });
      const currentRows = allRows?.map((r, i) => {
        return {
          ...r,
          id: i
        }
      })

      const moreRows = args.rows.map((r, i) => {
        return {
          ...r,
          id: i + currentRows.length
        }
      })

      const rows = [...currentRows, ...moreRows]

      await waitLoading(rows, 2000)
      setAllRows(rows)

      dispatch({
        payload: { rows },
        type: actions.LOAD_ROWS,
      });
      dispatch({
        type: actions.SET_DONE_LOADING,
      });
    },
    [allRows, args.rows, dispatch, waitLoading],
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
        {state?.loading ? 'loading...':'loaded'}
        <Paper style={{ height: '70vh' }}>
          <DataGrid2 {...args}
          totalCount={Number.MAX_VALUE}
            onLoadMore={() => simulateLoading()}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export const InfiniteLoader = InfiniteLoaderStory.bind({});
InfiniteLoader.args = {
  ...Default.args,
  hasDateRangeFilter: false,
  hasSearchFilter: false,
  filterable: false,
  showSelector: true,
  centerAccessory: () => <Typography variant="h6">Heading</Typography>,
  columns: [SelectColumn, ...columnData],
};

export const InfiniteLoaderManualOverride = InfiniteLoaderStory.bind({});
InfiniteLoaderManualOverride.args = {
  ...InfiniteLoader.args,
  manualLoadMore: true
}

export const ExtendedRowAttributes = DefaultStory.bind({});
ExtendedRowAttributes.args = {
  ...Default.args,
  extendedRowAttributes: (row) => {
    return {
      style: {
        backgroundColor: (row?.id % 2 === 0) ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'
      },
      title: `${row?.title}: ${row?.col3Type}`
    }
  }
};