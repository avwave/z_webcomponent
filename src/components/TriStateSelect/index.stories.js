import React from "react";
import { action, actions } from "@storybook/addon-actions";
import { TriStateSelect } from ".";

const TriStateSelectStory = {
  component: TriStateSelect,
  title: "TriStateSelect",
};

export default TriStateSelectStory;

const DefaultStory = ({ ...args }) => (
  <TriStateSelect {...args} onChange={(e)=> action(`TriStateSelect onClick ${e}`)} />
);
export const Default = DefaultStory.bind({})
Default.args = {
  title:'TriStateSelect1',
}
export const Checked = DefaultStory.bind({})
Checked.args = {
  title:'TriStateSelectChecked',
  checked: true
}

export const Unchecked = DefaultStory.bind({})
Unchecked.args = {
  title:'TriStateSelectUnchecked',
  checked: false
}

export const Undefined = DefaultStory.bind({})
Undefined.args = {
  title:'TriStateSelectUndefined',
  checked: null
}

