import { faker } from "@faker-js/faker"
import { Box, Chip } from "@mui/material"

faker.seed(123);

const generateRows = (count = 1) => {
  const rows = [...Array(count)].map((_, index) => index)

  return rows.map((row, index) => {
    return {
      id: faker.datatype.uuid(),
      index: index,
      string: faker.lorem.word(),
      name: faker.name.fullName(),
      number: faker.datatype.number(),
      float: faker.datatype.float(),
      percent: faker.datatype.float({ min: 0, max: 1 }),
      autocomplete: faker.helpers.arrayElement(['Tip', 'Top', 'Tap', 'Tup']),
      json: {
        value: faker.word.noun(),
        id: faker.datatype.uuid(),
      },
      date: faker.date.recent().toISOString(),
      react: <>
        {[...Array(faker.datatype.number({ min: 1, max: 15 }))]?.map(d => <Chip label={faker.word.verb()} />)}
      </>,
      boolean: faker.datatype.boolean(),
      largeText: faker.lorem.paragraphs(2),
      status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
    }
  })
}

const defaultRows = generateRows(20)

const defaultColumns = [
  {
    key: "name",
    name: "Name",
    sortable: true,
    dataType: "text",
    filter: {
      type: "text",
      default: "",
      label: "Name",
    },
  },
  {
    key: "number",
    name: "Number",
    sortable: true,
    dataType: "number",
    filter: {
      type: "number",
      default: "",
      label: "Number",
    },
  },
  {
    key: "float",
    name: "Float",
    sortable: true,
    dataType: "float",
    filter: {
      type: "float",
      default: "",
      label: "Float",
    },
  },
  {
    key: "date",
    name: "Date",
    sortable: true,
    dataType: "date",
    filter: {
      type: "dateRange",
    },
  },
  {
    key: "autocomplete",
    name: "Autocomplete",
    sortable: true,
    dataType: "text",
    filter: {
      type: "autocomplete",
      default: "",
      label: "Autocomplete",
      options: [
        { label: "Tip", value: "Tip" },
        { label: "Top", value: "Top" },
        { label: "Tap", value: "Tap" },
        { label: "Tup", value: "Tup" },
      ],
      labelField: 'label',
      valueField: 'value',
    },
  },
  {
    key: 'largeText',
    name: 'Large Text',
    sortable: true,
    dataType: 'text',
    columnProps: {
      grow:true,
    },
    filter: {
      type: 'text',
      default: '',
      label: 'Large Text',
    }
  },
  {
    key: "react",
    name: "React",
    sortable: false,
    dataType: "react",
  },

]
export { generateRows, defaultRows, defaultColumns }