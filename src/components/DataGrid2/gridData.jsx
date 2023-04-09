import {faker} from '@faker-js/faker'
import { FormControlLabel, IconButton, Chip, Select } from "@mui/material";
import Checkbox from "../../shared/Checkbox";
import { TriStateSelect } from "../TriStateSelect";
import { Delete, HotTubSharp, LocalHospital } from "@mui/icons-material";
import moment from "moment";
faker.seed(123);

const chipFilters = [
  {
    count: 0,
    type: "default",
    label: "Chip Default",
    value: "CHIP_D"
  },
  {
    count: 99,
    type: "warning",
    label: "Chip Warning",
    value: "CHIP_W"
  },
  {
    count: 999,
    type: "error",
    label: "Chip Error",
    value: "CHIP_E"
  },
  {
    count: 9999,
    type: "success",
    label: "Chip Success",
    value: "CHIP_S"
  },
]
const columnData = [
  {
    key: "id",
    name: "Frozen Column1",
    sortable: false,
    noTooltip: true,
    frozen: true,
  },
  {
    key: "title",
    name: "Filter: Text",
    sortable: true,
    resizable: true,
    width: 300,
    filter: {
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
    name: "Filter: Option",
    sortable: true,
    resizable: true,
    filter: {
      type: "autocomplete",
      default: "",
      label: "Is type of (autocomplete)",
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
    name: "Daterange Filter",
    sortable: false,
    resizable: true,
    filter: {
      type: "dateRange",
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
    name: "Button",
    sortable: false,
    // getCellValue: (row) => JSON.stringify(row.col7Type),
    cellRenderer({row, column}) {
      return (
        <IconButton
          onClick={() => {
            alert(JSON.stringify(row?.values, null, 2))
          }}
          size="large">
          <Delete color="secondary" />
        </IconButton>
      );
    }
  },
  {
    key: "col7Typer",
    name: "Formatted JSON",
    sortable: false,
    // getCellValue: (row) => JSON.stringify(row.col7Type),
    cellRenderer({row}) {
      return <span>stringified{JSON.stringify(row?.col7Type)}</span>
    }
  },
  {
    key: "col8Type",
    name: "React Component",
    sortable: false,
    width: 250,
    filter: {
      type: "chiptabs",
      default: "",
      label: "Chips of",
      labelField: 'label',
      options: chipFilters.map(d => {
        return {
          count: d?.count,
          type: d?.type,
          label: d?.label,
          v: d?.value
        }
      }),
    },
  },
];

let rows = [];
for (let i = 0; i < 100; i++) {
  rows.push({
    id: i,
    title: faker.name.findName(),
    col3Type: faker.datatype.number().toString(),
    col4Type: faker.date.recent().toISOString(),
    col5Type: faker.lorem.paragraphs(2),
    col6Type: faker.datatype.boolean() ? "Tip" : "Top",
    col7Type: { obj: 1 },
    col8Type: <>{[...Array(faker.datatype.number({min:1, max:15}))]?.map(d=><h1>REACTNODE</h1>)}</>,
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
