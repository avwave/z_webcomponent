import React, { useState } from "react";

import { status } from "../Checkbox/Checkbox";
import Checklist from "./Checklist";

import { withReactContext } from "storybook-react-context";
import CheckboxProvider, {
  actions,
  CheckboxContext,
  checkboxReducer,
} from "./checklistContext";
import { Button } from "../Button";
import { InputAdornment, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";

let defaultItems = [
  { id: "id1", title: "Task one", state: status.UNCHECKED },
  { id: "id2", title: "Task two", state: status.UNCHECKED },
  { id: "id3", title: "Task three", state: status.UNCHECKED },
  { id: "id4", title: "Task four", state: status.UNCHECKED },
  { id: "id5", title: "Task five", state: status.UNCHECKED },
  { id: "id6", title: "Task six", state: status.UNCHECKED },
  { id: "id7", title: "Task seven", state: status.UNCHECKED },
  { id: "id8", title: "Task eight", state: status.UNCHECKED },
  { id: "id9", title: "Task nine", state: status.UNCHECKED },
];

const ChecklistStory = {
  component: Checklist,
  title: "Checklist/List",

  onToggle: () => {},
  argTypes: {
    maxDisplayHeight: "500px",
  },
};

export default ChecklistStory;

export const EmptyStory = () => <Checklist title="Checklist compo" />;

export const Default = ({ ...args }) => {
  const [state, dispatch] = React.useContext(CheckboxContext);
  React.useEffect(() => {
    dispatch({
      payload: { items: args.items },
      type: actions.LOAD_ITEMS,
    });
  }, [dispatch]);
  return (
    <Checklist
      {...args}
    />
  );
};
Default.args = {
  title: "Checklist",
  items: defaultItems,
};

export const CustomLineItem = () => {
  const [state, dispatch] = React.useContext(CheckboxContext);
  React.useEffect(() => {
    dispatch({
      payload: { items: defaultItems },
      type: actions.LOAD_ITEMS,
    });
  }, [dispatch]);
  return (
    <Checklist
      title="TextList"
      lineItemComponent={({ item }) => <div>{item.title}</div>}
    />
  );
};

export const CountSelected = () => {
  const [state, dispatch] = React.useContext(CheckboxContext);
  React.useEffect(() => {
    dispatch({
      payload: { items: defaultItems },
      type: actions.LOAD_ITEMS,
    });
  }, [dispatch]);

  const itemCount = state.items.reduce(function (acc, current) {
    return acc + (current.state === status.CHECKED ? 1 : 0);
  }, 0);

  return (
    <>
      <Checklist title="Checklist" />
      <div>Checked count: {itemCount}</div>
      <div>
        Checked ids:
        {state.items
          .filter(function (item) {
            return item.state === status.CHECKED;
          })
          .map((item) => item.id + ",")}
      </div>
    </>
  );
};

export const ButtonCountSelected = () => {
  const [state, dispatch] = React.useContext(CheckboxContext);
  const selectedItems = state.items.filter(function (item) {
    return item.state === status.CHECKED;
  });

  const [output, setOutput] = useState("");
  React.useEffect(() => {
    dispatch({
      payload: { items: defaultItems },
      type: actions.LOAD_ITEMS,
    });
  }, [dispatch]);

  const itemCount = state.items.reduce(function (acc, current) {
    return acc + (current.state === status.CHECKED ? 1 : 0);
  }, 0);

  const printOutput = () => {
    const selected = setOutput(
      `to Send ids: ${selectedItems.map((item) => item.id).toString()}`
    );
  };
  return (
    <>
      <Checklist
        title="Checklist"
        actionComponent={
          <Button
            title={`Filter ${itemCount} items`}
            onClick={() => printOutput()}
          />
        }
      />
      <div>{output}</div>
    </>
  );
};

export const FilterActionComponent = () => {
  const [state, dispatch] = React.useContext(CheckboxContext);
  const selectedItems = state.items.filter(function (item) {
    return item.state === status.CHECKED;
  });

  const [output, setOutput] = useState("");
  React.useEffect(() => {
    dispatch({
      payload: { items: defaultItems },
      type: actions.LOAD_ITEMS,
    });
  }, [dispatch]);

  const itemCount = state.items.reduce(function (acc, current) {
    return acc + (current.state === status.CHECKED ? 1 : 0);
  }, 0);

  const printOutput = () => {
    const selected = setOutput(
      `to Send ids: ${selectedItems.map((item) => item.id).toString()}`
    );
  };
  return (
    <>
      <Checklist
        title="Checklist"
        filterActionComponent={
          <Button
            title={`Filter ${itemCount} items`}
            onClick={() => printOutput()}
          />
        }
      />
      <div>{output}</div>
    </>
  );
};

export const Filtering = ({ ...args }) => {
  const [state, dispatch] = React.useContext(CheckboxContext);
  const selectedItems = state.items.filter(function (item) {
    return item.state === status.CHECKED;
  });

  const [output, setOutput] = useState("");
  React.useEffect(() => {
    dispatch({
      payload: { items: args.items },
      type: actions.LOAD_ITEMS,
    });
  }, [dispatch]);

  const handleChange = (event) => {
    const filter = event.target.value;
    const items = args.items.filter((item) =>
      item.title.toLowerCase().includes(filter.toLowerCase())
    );
    dispatch({
      payload: { items: items },
      type: actions.LOAD_ITEMS,
    });
  };
  return (
    <>
      <Checklist
        title="Filterable Checklist"
        filterActionComponent={
          <TextField type="search" label="Filter..." onChange={handleChange} />
        }
      />
      <div>{output}</div>
    </>
  );
};

Filtering.args = {
  items: [...defaultItems],
};

export const LongFilter = Default.bind({});
LongFilter.args = {
  ...Default.args,
  items: [...defaultItems, ...defaultItems],
  maxDisplayHeight: "200px",
  actionComponent: <Button title="Action" />,
  filterActionComponent: <TextField type="search" label="Filter..." />,
};

export const TitleLess = Default.bind({});
TitleLess.args = {
  ...Default.args,
  items: [...defaultItems],
  title: "",
};

export const DefaultActionComponent = Default.bind({});
DefaultActionComponent.args = {
  ...Default.args,
  items: [...defaultItems, ...defaultItems],
  maxDisplayHeight: "200px",
  actionComponentLabel: "Action",
  actionComponentVariant: "primary",
  actionComponentOnClick: (selection) => {
    alert(JSON.stringify(selection));
  },
  filterActionComponent: (
    <TextField
      InputProps={{
        startAdornment: <InputAdornment position="start"><Search/></InputAdornment>
      }}
      type="search"
      label="Filter..."
    />
  ),
};
