import faker from "faker";
import { FormControlLabel, IconButton, MenuItem, Select } from "@material-ui/core";
import Checkbox from "../../shared/Checkbox";
import { TriStateSelect } from "../TriStateSelect";
import { Delete, HotTubSharp, LocalHospital } from "@material-ui/icons";
const columnData = [
  {
    key: "id",
    colId: "col1",
    name: "Column1",
    type: "text",
    sortable: false,
    noTooltip: true,
    frozen: true,
  },
  {
    key: "title",
    colId: "col2",
    name: "matrixparsedigital",
    type: "text",
    sortable: false,
    filter: {
      type: "text",
      label: "Contains",
      default: "",
    },
    align: "flex-start",
    noTooltip: true,
    cellStyles: {
      color: "red",
    },
    frozen: true,
  },
  {
    key: "col3Type",
    colId: "col3",
    name: "Long column name should really be wrappable up until small screens.  ideally should not be this long",
    cellStyles: {
      color: "green",
      fontWeight: "bold",
    },
    resizable: true,
    hidden: true,
    tooltip: (props) => {
      return props?.row?.col4Type
    }
  },
  {
    key: "col4Type",
    colId: "col4",
    name: "Column4",
    sortable: false,
    minWidth: 200,
    cellStyles: {
      fontStyle: "italic",
    },
    columnHeaderRenderer: (props) => {
      return <div {...props}><LocalHospital style={{ color: '#6A99CA' }} />Column4 </div>
    }
  },
  {
    key: "col5Type",
    colId: "col5",
    name: "Column5",
    sortable: false,
    align: "flex-start",
    hidden: true,
  },
  {
    key: "col6Type",
    colId: "col6",
    name: "Column6",
    sortable: true,
    filter: {
      type: "option",
      default: "",
      label: "Is type of",
      options: [
        {
          label: "Tip",
          value: "tip",
        },
        {
          label: "Top",
          value: "top",
        },
      ],
    },
  },
  {
    key: "button",
    colId: "button",
    name: "Button",
    sortable: false,
    // getCellValue: (row) => JSON.stringify(row.col7Type),
    cellRenderer({row, column}) {
      return (
        <IconButton
          onClick={() => {
            alert(JSON.stringify({column, row}, null, 2))
          }}>
          <Delete color="secondary" />
        </IconButton>
      )
    }
  },
  {
    key: "col7Typer",
    colId: "col7r",
    name: "Column7r",
    sortable: false,
    // getCellValue: (row) => JSON.stringify(row.col7Type),
    getCellValue(row) {
      return <span>stringified{JSON.stringify(row?.col7Type)}</span>
    }
  },
  {
    key: "col8Type",
    colId: "col8",
    name: "Column8",
    sortable: false,
    width: 250
  },
  {
    key: "col9Type",
    colId: "col9",
    name: "Column9",
    sortable: false,
    filter: {
      type: "custom",
      default: null,
    },
    filterRenderer: ({ onChange, value }) => {
      return (
        <FormControlLabel
          control={
            <TriStateSelect
              checked={value ?? null}
              onChange={(e) => {
                onChange(e);
              }}
            />
          }
          label="has"
        />
      );
    },
  },
];

let rows = [];
faker.seed(123);
for (let i = 0; i < 20; i++) {
  rows.push({
    id: `row${i}`,
    title: faker.name.findName(),
    col3Type: faker.random.number().toString(),
    col4Type: faker.date.recent().toISOString(),
    col5Type: faker.lorem.paragraphs(2),
    col6Type: faker.datatype.boolean() ? "Tip" : "Top",
    col7Type: { obj: 1 },
    col8Type: <h1>REACTNODE</h1>,
    col9Type: faker.datatype.boolean() ? faker.random.word() : null,
  });
}
export { columnData, rows };
