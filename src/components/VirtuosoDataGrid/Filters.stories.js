import {
  Chip,
  Paper
} from "@mui/material";
import React, { useState } from "react";
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
            renderLabel: <Chip label={v}/>,
            label: v,
            v: v
          }
        })],
      },
    }
  ]
}