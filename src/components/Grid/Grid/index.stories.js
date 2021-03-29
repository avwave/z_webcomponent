import React from "react";
import { action, actions } from "@storybook/addon-actions";
import { Grid } from ".";

const GridStory = {
  component: Grid,
  title: "Grid/Grid",
};

export default GridStory;

let defaultItems = [
  {
    hasProgress: true,
    columnTitle: "Col1",
    columnSubtitle: "ColSub1",
    items: [
      { id: "id1-1", title: "Elem one", variant: "default" },
      { id: "id1-2", title: "Elem two", subtitle: "(scheduled)", variant: "scheduled" },
      { id: "id1-3", title: "Elem three", variant: "default" },
    ]
  },
  {
    hasProgress: false,
    columnTitle: "Col2",
    columnSubtitle: "ColSub2",
    items: [
      { id: "id2-1", title: "Elem one", variant: "default" },
      { id: "id2-2", title: "Elem two", subtitle: "(closed)", variant: "closed" },
      { id: "id2-3", title: "Elem three", variant: "default" },
    ]
  },
  {
    hasProgress: false,
    columnTitle: "Col3",
    columnSubtitle: "ColSub3",
    items: [
      { id: "id3-1", title: "Elem one", variant: "default" },
      { id: "id3-2", title: "Elem two", subtitle: "(available)", variant: "available" },
      { id: "id3-3", title: "Elem three", variant: "default" },
    ]
  },
  {
    hasProgress: false,
    columnTitle: "Col4",
    columnSubtitle: "ColSub4",
    items: [
      { id: "id4-1", title: "Elem one", variant: "default" },
      { id: "id4-2", title: "Elem two", subtitle: "(scheduled)", variant: "scheduled" },
      { id: "id4-3", title: "Elem three", variant: "default" },
    ]
  },
];

const DefaultStory = ({ ...args }) => {
  return <Grid {...args} />;
};

export const Default = DefaultStory.bind({});
Default.args = {
  columns: defaultItems,
};

