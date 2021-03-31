import faker from "faker";
const columnData = [
  {
    key: "id",
    colId: "col1",
    name: "Column1",
    type: "text",
    sortable: false,
  },
  {
    key: "title",
    colId: "col2",
    name: "Column2",
    type: "text",
    sortable: false,
    filter: "text",
  },
  {
    key: "col3Type",
    colId: "col3",
    name: "Column3",
    sortable: false
  },
  {
    key: "col4Type",
    colId: "col4",
    name: "Column4",
    sortable: false
  },
  {
    key: "col5Type",
    colId: "col5",
    name: "Column5",
    sortable: false
  },
  {
    key: "col6Type",
    colId: "col6",
    name: "Column6",
    sortable: false
  },
  {
    key: "col7Type",
    colId: "col7",
    name: "Column7",
    sortable: false
  },
  {
    key: "col8Type",
    colId: "col8",
    name: "Column8",
    sortable: false
  },
  {
    key: "col9Type",
    colId: "col9",
    name: "Column9",
    sortable: false
  },
];

let rows = []

for (let i = 0; i < 3; i++) {
  rows.push({
    id: `row${i}`,
    title: faker.name.findName(),
    col3Type: faker.random.number().toString(),
    col4Type: faker.date.recent().toISOString(),
    col5Type: faker.random.word(),
    col6Type: faker.random.word(),
    col7Type: faker.random.word(),
    col8Type: faker.random.word(),
    col9Type: faker.random.word(),
  });
  
}
export { columnData, rows };
