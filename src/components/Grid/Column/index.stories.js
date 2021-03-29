import React from "react";
import { action, actions } from "@storybook/addon-actions";
import { Column } from ".";

const ColumnStory = {
  component: Column,
  title: "Grid/Column",
};

export default ColumnStory;

let defaultItems = [
  { id: "id1", title: "Elem one", variant: "default" },
  { id: "id2", title: "Elem two (scheduled)", variant: "scheduled" },
  { id: "id3", title: "Elem three", variant: "default" },
  { id: "id4", title: "Elem four", variant: "default" },
  { id: "id5", title: "Elem five", variant: "default" },
];


const DefaultStory = ({ ...args }) => {
  return (
  <Column {...args}/>
)};


export const Default = DefaultStory.bind({});
Default.args = {
  columnTitle: "ColTitle",
  columnSubtitle: "ColSubtitle",
  items: defaultItems
};

export const Progress = DefaultStory.bind({});
Progress.args = {
  columnTitle: "ColTitle",
  columnSubtitle: "ColSubtitle",
  items: defaultItems,
  hasProgress: true
};

