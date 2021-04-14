import { Chip } from "@material-ui/core";

import React from "react";
import { withReactContext } from "storybook-react-context";
import { DataGrid } from ".";
import { Button } from "../Button";
import isEmpty from "lodash.isempty";

import { columnData, rows } from "./gridData";
import DataGridProvider, {
  dataGridReducer,
  DataGridContext,
  actions,
  initState,
} from "./DataGridContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
  }, [args.columns, args.rows, dispatch]);

  return <DataGrid {...args} />;
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

    dispatch({
      type: actions.SET_LOADING,
    });

    const timer = setTimeout(() => {
      fetchData();
    }, 1500);

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
    if (isEmpty(state.filterColumn)) {
      console.log("ue filter init state");
      return;
    }
    const searchKeys = Object.keys(state.filterColumn);

    let filteredRows = args.rows;
    searchKeys.map((searchKey) => {
      filteredRows = filteredRows.filter((row) => {
        return row[searchKey]
          .toLowerCase()
          .includes(state.filterColumn[searchKey].toLowerCase());
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

  return <DataGrid {...args} />;
};
export const ServerFilterSort = ServerFilterSortStory.bind({});
ServerFilterSort.args = {
  ...Default.args,
  showSelector: true,
  filterable: true,
  columns: columnData.map((cols) => {
    return { ...cols, sortable: true, filter: "text" };
  }),
};
