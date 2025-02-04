import {faker} from '@faker-js/faker'
import { FormControlLabel, MenuItem, Select } from "@mui/material";
import Checkbox from "../../shared/Checkbox";
import { TriStateSelect } from "../TriStateSelect";
import { HotTubSharp, LocalHospital } from "@mui/icons-material";
const columnData = [
  {
    key: "id",
    colId: "col1",
    name: "Column1",
    type: "text",
    sortable: false,
    noTooltip: true,
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
    tooltip: (props) => {
      return props.row.col4Type
    }
  },
  {
    key: "col4Type",
    colId: "col4",
    name: "Column4",
    sortable: false,
    cellStyles: {
      fontStyle: "italic",
    },
    columnHeaderRenderer: (props) => {
      return <div {...props}><LocalHospital style={{ color: '#6A99CA' }}/>Column4 </div>
    }
  },
  {
    key: "col5Type",
    colId: "col5",
    name: "Column5",
    sortable: false,
    align: "flex-start",
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
    key: "col7Type",
    colId: "col7",
    name: "Column7",
    sortable: false,
    cellRenderer({row}) {
      return <span>stringified{JSON.stringify(row.col7Type)}</span>
    }
  },
  {
    key: "col8Type",
    colId: "col8",
    name: "Column8",
    sortable: false,
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
for (let i = 0; i < 100; i++) {
  rows.push({
    id: `row${i}`,
    title: faker.name.fullName(),
    col3Type: faker.datatype.number().toString(),
    col4Type: faker.date.recent().toISOString(),
    col5Type: faker.lorem.paragraphs(2),
    col6Type: faker.datatype.boolean() ? "Tip" : "Top",
    col7Type: {obj: 1},
    col8Type: <h1>REACTNODE</h1>,
    col9Type: faker.datatype.boolean() ? faker.random.word() : null,
    colArray: [...Array(faker.datatype.number({
      min:1,
      max:5
    })).fill(0).map(d=>{
      return {value:faker.random.word()}
    })]
  });
}
export { columnData, rows };
