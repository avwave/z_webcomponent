import {
  Button,
  ButtonGroup,
  Chip,
  Grid,
  Link,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { ZennyaLogFormat } from '../../index';

import isEmpty from "lodash.isempty";

import {
  DataGridContext,
  actions
} from "../DataGrid/DataGridContext";
import { columnData, rows } from "../DataGrid2/gridData";

import { faColumns } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { action } from "@storybook/addon-actions";
import moment from "moment";
import { Item as ContextItem, Menu as ContextMenu } from "react-contexify";
import ReactJson from "react-json-view";
import { auditLogs } from "../Logger/index.stories";
import { VirtuosoDataGrid as DataGrid2 } from "./index";

const DataGridStory = {
  component: DataGrid2,
  title: "DataGrid/DataGridV3/archived",
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
  id: `archived-default`,
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
      state?.loading ? 'loading' : 'finished'
    }
    <DataGrid2 {...args} />
  </Paper>;
};

export const Loading = LoadingStory.bind({});
Loading.args = {
  ...Default.args,
  id: `archived-loading`,
}

export const Basic = DefaultStory.bind({});
Basic.args = {
  id: `archived-basic`,
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
  id: `archived-customColumnDisplay`,
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
            console.log("📢[onSelectedRowsChange]: ", rows);
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
  id: `archived-conditionalSelector`,
  rows: [
    {
      id: 1,
      name: 'Alice',
      age: 20,
      age1: 20
    },
    {
      id: 2,
      name: 'Bob',
      age: 21,
      age1: 21
    },
    {
      id: 3,
      name: 'Charlie',
      age: 22,
      age1: 22
    },
    {
      id: 3,
      name: 'Pants Aruba Pizza schemas navigating Rustic Facilitator',
      age: 'innovate Colorado',
      age1: 'innovate Colorado'
    }
  ],
  columns: [
    
    {
      key: "name",
      name: "Name",
      selectable({ row }) {
        return row.id !== 2
      }
    },
    {
      key: "name",
      name: "Name",
      grow: true

    },
    {
      key: "age",
      name: "Age",

    },
    {
      key: "age1",
      name: "Age",
      width: 10
    },
    {
      key: "age2",
      name: "Age",
      width: 200
    },
    {
      key: "age3",
      name: "Age",
      width: 50
    },
    {
      key: "age4",
      name: "Age",
      width: 50
    },
    {
      key: "age5",
      name: "Age",
      width: 50
    },
    {
      key: "age6",
      name: "Age",
      width: 50
    },
  ]
}

export const ToolbarSearchPlaceholder = DefaultStory.bind({});
ToolbarSearchPlaceholder.args = {
  id: `archived-toolbarSearchPlaceholder`,
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

    name: "Column4",
    align: "flex-start",
    cellRenderer(props) {
      return <CellFormatting value={{ ...props, key: "col_truncate" }} />;
    },
  },
];

CellFormatter.args = {
  ...Default.args,
  id: `archived-cellFormatter`,
  columns: applyDateColumn,
};

export const Reorderable = DefaultStory.bind({});
Reorderable.args = {
  ...Default.args,
  id: `archived-reorderable`,
  draggable: true,
  columns: columnData,
};
export const Blank = DefaultStory.bind({});
Blank.args = {
  ...Default.args,
  id: `archived-blank`,
  rows: [],
  draggable: true,
  columns: columnData,
  gridProps: {
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
  id: `archived-noHeaderElements`,
  hasDateRangeFilter: false,
  hasSearchFilter: false,
  filterable: false
}

export const GridProps = DefaultStory.bind({});
GridProps.args = {
  ...Default.args,
  id: `archived-gridProps`,
  draggable: true,
  columns: columnData,
  gridProps: {
    rowHeight: 60,
  },
};

export const ClientSortable = DefaultStory.bind({});
ClientSortable.args = {
  ...Default.args,
  id: `archived-clientSortable`,
  columns: columnData.map((cols) => {
    return { ...cols, sortable: true };
  }),
};

export const ColumnDisplaySelection = DefaultStory.bind({});
ColumnDisplaySelection.args = {
  ...Default.args,
  id: `archived-columnDisplaySelection`,
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
        let searchItem = row[searchKey]
        if (searchKey === 'search') {
          const searchItem1 = row['col_truncate']
          const searchItem2 = row['filter_text']
          const ret1 = searchItem1.toLowerCase().includes(state.filterColumn[searchKey])
          const ret2 = searchItem2.toLowerCase().includes(state.filterColumn[searchKey])
          return ret1 || ret2
        }
        console.log('index.stories.js (342) # searchItem', searchItem);

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
          // return ret
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
  id: `archived-serverFilter`,
  useUrlAsState: true,
  showSelector: true,
  filterable: true,
};

export const AlternateCriteriaEditor = ServerFilterStory.bind({});
AlternateCriteriaEditor.args = {
  ...ServerFilter.args,
  id: `archived-alternateCriteriaEditor`,
  alternateToolbarFilter: true,
}

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
  id: `archived-serverSort`,
  showSelector: true,
  filterable: true,
};

export const Selectable = SelectableStory.bind({});
Selectable.args = {
  ...Default.args,
  id: `archived-selectable`,
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
  id: `archived-demoContextMenu`,
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
  id: `archived-toolbarAccessory`,
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
  id: `archived-redrawBug`,
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
  id: `archived-loader`,
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
        {state?.loading ? 'loading...' : 'loaded'}
        <Paper style={{ height: '90vh' }}>
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
  id: `archived-infiniteLoader`,
  hasDateRangeFilter: false,
  hasSearchFilter: false,
  filterable: false,
  showSelector: true,
  centerAccessory: () => <Typography variant="h6">Heading</Typography>,
  columns: [...columnData],
  loadMoreTriggerOffset: 1000
};

export const InfiniteLoaderManualOverride = InfiniteLoaderStory.bind({});
InfiniteLoaderManualOverride.args = {
  ...InfiniteLoader.args,
  id: `archived-infiniteLoaderManualOverride`,
  manualLoadMore: true
}

export const ExtendedRowAttributes = DefaultStory.bind({});
ExtendedRowAttributes.args = {
  ...Default.args,
  id: `archived-extendedRowAttributes`,
  extendedRowAttributes: (row) => {
    return {
      style: {
        backgroundColor: (row?.id % 2 === 0) ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'
      },
      title: `${row?.title}: ${row?.col3Type}`
    }
  }
};

export const ZennyaLogger = DefaultStory.bind({});
ZennyaLogger.args = {
  ...Default.args,
  id: `archived-zennyaLogger`,
  columns: [
    {

      key: 'date_created',
      name: 'Date Created',
      resizable: false,
      width: 200,

      cellRenderer({ row }) {
        return <Typography variant="overline">{moment(row?.date_created).format('L LTS')}</Typography>
      }
    },
    {

      key: 'log_type',
      name: 'Log Type',
      resizable: true,
      width: 60,
      cellRenderer({ row }) {
        return <Typography variant="caption">{row?.log_type}</Typography>
      }
    },
    {

      key: 'resource',
      name: 'Customer Link',
      resizable: true,
      width: 100,
      cellRenderer({ row }) {
        if (row?.resource_type === 'CUSTOMER') {
          return (
            <Link
              to={`/client-profile/${row?.resource_id}`}
              underline="hover">Customer: {row?.resource_id}</Link>
          );
        }
        return <></>
      }
    },
    {

      key: 'log_message',
      name: 'Log',
      resizable: true,
      wrap: true,
      cellRenderer({ row }) {
        const x = <ZennyaLogFormat
          log={row}
          linkComponent={Link}
          routeMap={
            [
              {
                resourceName: 'booking',
                pattern: '/scheduled-bookings/:id'
              },
              {
                resourceName: 'wlpCustomer',
                pattern: '/client-profile/:id'
              },
              {
                resourceName: 'resource_id',
                pattern: '/client-profile/:id'
              },
              {
                resourceName: 'user_id',
                pattern: '/staff/edit/:id'
              },
              {
                resourceName: 'client_id',
                pattern: '/client-profile/:id'
              },
              {
                resourceName: 'wlpPartner',
                pattern: '/'
              }
            ]
          }
        />
        return x
      }
    },
  ],
  rows: auditLogs
}

export const TruncatedZennyaLogs = DefaultStory.bind({});
TruncatedZennyaLogs.args = {
  ...ZennyaLogger.args,
  id: `archived-truncatedZennyaLogs`,
  columns: [
    {

      key: 'date_created',
      name: 'Date Created',
      resizable: false,
      width: 200,

      cellRenderer({ row }) {
        return <Typography variant="overline">{moment(row?.date_created).format('L LTS')}</Typography>
      }
    },
    {

      key: 'log_type',
      name: 'Log Type',
      resizable: true,
      width: 60,
      cellRenderer({ row }) {
        return <Typography variant="caption">{row?.log_type}</Typography>
      }
    },
    {

      key: 'resource',
      name: 'Customer Link',
      resizable: true,
      width: 100,
      cellRenderer({ row }) {
        if (row?.resource_type === 'CUSTOMER') {
          return (
            <Link
              to={`/client-profile/${row?.resource_id}`}
              underline="hover">Customer: {row?.resource_id}</Link>
          );
        }
        return <></>
      }
    },
    {

      key: 'log_message',
      name: 'Log',
      resizable: true,
      wrap: false,
      cellRenderer({ row }) {
        const x = <ZennyaLogFormat
          log={row}
          linkComponent={Link}
          routeMap={
            [
              {
                resourceName: 'booking',
                pattern: '/scheduled-bookings/:id'
              },
              {
                resourceName: 'wlpCustomer',
                pattern: '/client-profile/:id'
              },
              {
                resourceName: 'resource_id',
                pattern: '/client-profile/:id'
              },
              {
                resourceName: 'user_id',
                pattern: '/staff/edit/:id'
              },
              {
                resourceName: 'client_id',
                pattern: '/client-profile/:id'
              },
              {
                resourceName: 'wlpPartner',
                pattern: '/'
              }
            ]
          }
        />
        return x
      }
    },
  ],
}
