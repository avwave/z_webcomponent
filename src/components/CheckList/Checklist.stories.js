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

let defaultItems = [
  { id: "id1", title: "Task 1", state: status.UNCHECKED },
  { id: "id2", title: "Task 2", state: status.UNCHECKED },
  { id: "id3", title: "Task 3", state: status.UNCHECKED },
  { id: "id4", title: "Task 4", state: status.UNCHECKED },
  { id: "id5", title: "Task 5", state: status.UNCHECKED },
  { id: "id6", title: "Task 6", state: status.UNCHECKED },
  { id: "id7", title: "Task 7", state: status.UNCHECKED },
  { id: "id8", title: "Task 8", state: status.UNCHECKED },
  { id: "id9", title: "Task 9", state: status.UNCHECKED },
];

const ChecklistStory = {
  component: Checklist,
  title: "Checklist",
  decorators: [
    withReactContext({
      reducer: checkboxReducer,
      context: CheckboxContext,
      initialState: { items: [] },
    }),
    (Story) => (
      <CheckboxProvider>
        <Story />
      </CheckboxProvider>
    ),
  ],
  onToggle: () => {},
};

export default ChecklistStory;

export const EmptyStory = () => <Checklist title="Checklist compo" />;

export const Filled = () => {
  const [state, dispatch] = React.useContext(CheckboxContext);
  React.useEffect(() => {
    dispatch({
      payload: { items: defaultItems },
      type: actions.LOAD_ITEMS,
    });
  }, [dispatch]);
  return <Checklist title="Checklist" />;
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
