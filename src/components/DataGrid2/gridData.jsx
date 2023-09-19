import {faker} from '@faker-js/faker'
import { FormControlLabel, IconButton, Chip, Select, Button, ButtonGroup } from "@mui/material";
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
    key: "labarray",
    name:'LabArray',
    filter:{
      type:'autocomplete',
      label:'LabArray',
      options: [{ "id": 6, "label": "Arc Hospital, Lapu Lapu City" }, { "id": 1, "label": "Exact Check" }, { "id": 8, "label": "New World Diagnostics" }, { "id": 4, "label": "Reliance" }, { "id": 7, "label": "Singapore Diagnostics, Cebu" }, { "id": 3, "label": "Singapore Diagnostics, Makati" }, { "id": 5, "label": "SMC" }],
      labelField:'label',
      valueField:'id',
      multiple:true,
    },
    frozen: true,
  },
  {
    key: "filter_text",
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
    key: "col_filter_option",
    name: "Filter: Option",
    sortable: true,
    resizable: true,
    width: 100,
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
    key: "col_filter_daterange",
    name: "Custom Daterange Filter",
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
    key: "col_hidden",
    name: "Hidden",
    cellStyles: {
      color: "green",
      fontWeight: "bold",
    },
    resizable: true,
    hidden: true,
    tooltip: (props) => {
      return props?.row?.col_customheader
    },
  },
  {
    key: "col_customheader",
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
      return <span>{moment(props.row.col_customheader).format('LL LTS')}</span>
    }
  },
  {
    key: "col_truncate",
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
    // getCellValue: (row) => JSON.stringify(row.col_json),
    cellRenderer({row, column}) {
      return (
        <IconButton
          onClick={() => {
            alert(JSON.stringify(row, null, 2))
          }}
          size="small">
          <Delete color="secondary" />
        </IconButton>
      );
    }
  },
  {
    key: "col_jsonr",
    name: "Formatted JSON",
    sortable: false,
    // getCellValue: (row) => JSON.stringify(row.col_json),
    cellRenderer({row}) {
      return <span>stringified{JSON.stringify(row?.col_json)}</span>
    }
  },
  {
    key: "col_react",
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
for (let i = 0; i < 30; i++) {
  rows.push({
    id: `id-${i}`,
    filter_text: faker.name.fullName(),
    col_hidden: faker.datatype.number().toString(),
    col_customheader: faker.date.recent().toISOString(),
    col_truncate: faker.lorem.paragraphs(2),
    col_filter_option: faker.datatype.boolean() ? "Tip" : "Top",
    col_json: { obj: 1 },
    col_react: <ButtonGroup>{[...Array(faker.datatype.number({min:1, max:15}))]?.map(d=><Button>Butten</Button>)}</ButtonGroup>,
    col_filter_daterange: faker.datatype.boolean() ? faker.random.word() : null,
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
