import {
  Chip,
  Paper,
  Box
} from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  DataGridContext,
  actions
} from "../DataGrid/DataGridContext";
import { generateRows } from "./gridData";
import { VirtuosoDataGrid as DataGrid2 } from "./index";
import ReactJson from "react-json-view";
import { faker } from "@faker-js/faker";

const DataGridFilterStory = {
  component: DataGrid2,
  title: "DataGrid/DataGridV3/Filters",
  parameters: {
    // chromatic: { disable: true },
    // storyshots: { disable: true },
  },
};

export default DataGridFilterStory;

const DefaultStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);
  const [filters, setFilters] = useState({});
  React.useEffect(() => {
    dispatch({
      payload: { rows: args.rows, columns: args.columns },
      type: actions.LOAD_DATA,
    });
    dispatch({
      type: actions.SET_DONE_LOADING,
    });
  }, [args.columns, args.rows, dispatch]);

  React.useEffect(() => {
    setFilters(state.filterColumn);
  }, [state.filterColumn]);

  return <>
    <ReactJson name="Filter Object can be sent to server" src={{ filters }} />
    <Paper style={{ height: '100' }}>
      <DataGrid2 {...args} />
    </Paper>;
  </>

};


export const Default = DefaultStory.bind({});
Default.args = {
  filterable: true,
  alternateToolbarFilter: true,
  rows: generateRows(1),
  columns: [
    {
      key: "string",
      name: "String",
      dataType: "text",
      filter: {
        type: "text",
      }
    }
  ]
}

export const LegacyCriteriaEditorFilter = DefaultStory.bind({});
LegacyCriteriaEditorFilter.args = {
  ...Default.args,
  alternateToolbarFilter: false,
}


const HeightBugStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);
  const [filters, setFilters] = useState({});
  React.useEffect(() => {
    dispatch({
      payload: { rows: args.rows, columns: args.columns },
      type: actions.LOAD_DATA,
    });
    dispatch({
      type: actions.SET_DONE_LOADING,
    });
  }, [args.columns, args.rows, dispatch]);

  React.useEffect(() => {
    setFilters(state.filterColumn);
  }, [state.filterColumn]);

  return <>
    <ReactJson name="Filter Object can be sent to server" src={{ filters }} />
    <Box sx={{ height: '70vh' }} />
    <Paper style={{ height: '100' }}>
      <DataGrid2 {...args} />
    </Paper>
    <Box sx={{ height: '70vh' }} />

  </>

};


export const HeightBug = HeightBugStory.bind({});
HeightBug.args = {
  filterable: true,
  alternateToolbarFilter: false,
  rows: generateRows(1),
  columns: [
    {
      key: "string",
      name: "String",
      dataType: "text",
      filter: {
        type: "text",
      }
    }
  ]
}




export const SingleAutocompleteFilter = DefaultStory.bind({});
SingleAutocompleteFilter.args = {
  ...Default.args,
  columns: [
    {
      key: "autocomplete",
      name: "Autocomplete",
      dataType: "text",
      filter: {
        type: "autocomplete",
        default: "",
        label: "Autocomplete",
        options: [
          { label: "Label Tip", value: "Tip" },
          { label: "Label Top", value: "Top" },
          { label: "Label Tap", value: "Tap" },
          { label: "Label Tup", value: "Tup" },
        ],
        labelField: 'label',
        valueField: 'value',
        multiple: false,
      },
    }
  ]
}


export const MultipleAutocompleteFilter = DefaultStory.bind({});
MultipleAutocompleteFilter.args = {
  ...Default.args,
  columns: [
    {
      key: "autocomplete",
      name: "Autocomplete",
      dataType: "text",
      filter: {
        type: "autocomplete",
        default: [],
        label: "Autocomplete",
        options: [
          { label: "Label Tip", value: "Tip" },
          { label: "Label Top", value: "Top" },
          { label: "Label Tap", value: "Tap" },
          { label: "Label Tup", value: "Tup" },
        ],
        labelField: 'label',
        valueField: 'value',
        multiple: true,
      },
    }
  ]
}

export const RenderLabelOptionFilter = DefaultStory.bind({});
RenderLabelOptionFilter.args = {
  ...Default.args,
  columns: [
    {
      key: "autocomplete",
      name: "Autocomplete",
      filter: {
        type: "autocomplete",
        default: "",
        label: "Autocomplete Rendered Options",
        labelField: 'label',
        renderLabel: 'renderLabel',
        valueField: 'v',
        multiple: true,
        options: [...Array(faker.datatype.number({
          min: 4,
          max: 4
        })).fill(0).map(d => {
          const v = faker.random.word()
          return {
            renderLabel: <Chip label={v} />,
            label: v,
            v: v
          }
        })],
      },
    }
  ]
}

function numberToEnglishText(number) {
  switch (number) {
    case 1:
      return "One";
    case 2:
      return "Two";
    case 3:
      return "Three";
    case 4:
      return "Four";
    case 5:
      return "Five";
    case 6:
      return "Six";
    case 7:
      return "Seven";
    case 8:
      return "Eight";
    case 9:
      return "Nine";
    case 10:
      return "Ten";
    default:
      return "";
  }
}

const apiFilters = Array.from({ length: 10 }, (_, index) => ({
  value: (index + 1).toString(),
  label: numberToEnglishText(index + 1)
}));


const fetchApiFilters = async ({
  model
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = apiFilters.filter(f => f.label.toLowerCase().includes(model.toLowerCase()))
      console.log('fetchApiFilters (217) # filtered', filtered, model, apiFilters);
      resolve(filtered)
    }, 1000)
  })
}

const APIStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(DataGridContext);
  const [filters, setFilters] = useState({});

  const columns = useMemo(
    () => {
      const cols = [
        {
          key: "autocomplete",
          name: "Autocomplete",
          filter: {
            type: "apiAutocomplete",
            default: "",
            label: "Autocomplete API",
            labelField: 'label',
            valueField: 'value',
            multiple: true,
            apiCallback: fetchApiFilters,
            apiOptions: {
              parameterName: 'model'
            }
          },
        }
      ]
      return cols
    }, []
  );

  React.useEffect(() => {
    dispatch({
      payload: { rows: [], columns: columns },
      type: actions.LOAD_DATA,
    });
    dispatch({
      type: actions.SET_DONE_LOADING,
    });
  }, [columns, dispatch]);

  React.useEffect(() => {
    setFilters(state.filterColumn);
  }, [state.filterColumn]);


  
  return <>
    <ReactJson name="Filter Object can be sent to server" src={{ filters }} />
    <Paper style={{ height: '100' }}>
      <DataGrid2
        {...args}
        columns={columns}
      />
    </Paper>
  </>

};



export const APIAutocompleteFilter = APIStory.bind({});
APIAutocompleteFilter.args = {
  ...Default.args,
  alternateToolbarFilter: false,
}