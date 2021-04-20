import faker from "faker";
import { FormControlLabel, MenuItem, Select } from "@material-ui/core";
import Checkbox from "../../shared/Checkbox";
import { TriStateSelect } from "../TriStateSelect";
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
    name: "Column2",
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
    name: "Column3",
    sortable: false,
    cellStyles: {
      color: "green",
      fontWeight: "bold",
    },
  },
  {
    key: "col4Type",
    colId: "col4",
    name: "Column4",
    sortable: false,
    cellStyles: {
      fontStyle: "italic",
    },
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

for (let i = 0; i < 20; i++) {
  rows.push({
    id: `row${i}`,
    title: faker.name.findName(),
    col3Type: faker.random.number().toString(),
    col4Type: faker.date.recent().toISOString(),
    col5Type: faker.lorem.paragraphs(2),
    col6Type: faker.datatype.boolean() ? "Tip" : "Top",
    col7Type: faker.random.word(),
    col8Type: faker.random.word(),
    col9Type: faker.datatype.boolean() ? faker.random.word() : null,
  });
}
export { columnData, rows };
