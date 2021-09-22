import faker from "faker";
import { FormControlLabel, IconButton, MenuItem, Select } from "@material-ui/core";
import Checkbox from "../../shared/Checkbox";
import { TriStateSelect } from "../TriStateSelect";
import { Delete, HotTubSharp, LocalHospital } from "@material-ui/icons";
import moment from "moment";
faker.seed(123);


const columnData = [
  {
    key: "id",
    colId: "col1",
    name: "Frozen Column1",
    type: "text",
    sortable: false,
    noTooltip: true,
    frozen: true,
  },
  {
    key: "title",
    colId: "col2",
    name: "Filter: Text",
    type: "text",
    sortable: false,
    width: 300,
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
    key: "col6Type",
    colId: "col6",
    name: "Filter: Option",
    sortable: true,
    filter: {
      type: "autocomplete",
      default: "",
      label: "Is type of",
      labelField: 'label',
      renderLabel: 'renderLabel',
      valueField: 'v',
      multiple: true,
      options: [...Array(faker.datatype.number({
        min:4,
        max:20
      })).fill(0).map(d => {
        const v = faker.random.word()
        return {
          renderLabel: <h2>{v}</h2>,
          label: v,
          v: faker.random.word()
        }
      })],
      
    },
  },
  {
    key: "col9Type",
    colId: "col9",
    name: "Custom Filter",
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
    },
  },
  {
    key: "col4Type",
    colId: "col4",
    name: "Custom Header",
    sortable: false,
    minWidth: 200,
    cellStyles: {
      fontStyle: "italic",
    },
    columnHeaderRenderer: (props) => {
      return <div {...props}><LocalHospital style={{ color: '#6A99CA' }} />Custom Header</div>
    },
    cellRenderer: (props) => {
      return <span>{moment(props.row.col4Type).format('LL LTS')}</span>
    }
  },
  {
    key: "col5Type",
    colId: "col5",
    name: "Truncate",
    sortable: false,
    align: "flex-start",
    hidden: false,
    filter: {
      type: "option",
      default: "",
      label: "Is type of",
      labelField: 'label',
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
    name: "Formatted JSON",
    sortable: false,
    // getCellValue: (row) => JSON.stringify(row.col7Type),
    cellRenderer({row}) {
      return <span>stringified{JSON.stringify(row?.col7Type)}</span>
    }
  },
  {
    key: "col8Type",
    colId: "col8",
    name: "React Component",
    sortable: false,
    width: 250
  },
];

let rows = [];
for (let i = 0; i < 5; i++) {
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
    tests: [...Array(faker.datatype.number({
      min:1,
      max:5
    })).fill(0).map(d => {
      return {
        "test": {
          "id": 5,
          "name": "LIPID_PROFILE",
          "label": "Lipid Profile",
          "cpt_code": "80061"
        },
        "is_adhoc": false,
        "package_id": 8
      }
    })],
    packages: [
      {
        "package": {
          "id": 8,
          "name": "ROUTINE",
          "label": "Routine Check"
        }
      }
    ]
  });
}
export { columnData, rows };
