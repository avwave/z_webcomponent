import React from "react";
import { action, actions } from "@storybook/addon-actions";
import { Element } from ".";

const ElementStory = {
  component: Element,
  title: "Grid/Element",
};

export default ElementStory;

const DefaultStory = ({ ...args }) => (
  <Element {...args} onClick={action("Element onClick")} />
);
export const Default = DefaultStory.bind({});
Default.args = {
  title: "Element1",
  variant: "default",
};

export const Selected = DefaultStory.bind({});
Selected.args = {
  title: "Element1",
  subtitle: "subtitle",
  variant: "default",
  selected: true,
};

export const Subtitle = DefaultStory.bind({});
Subtitle.args = {
  title: "Element1",
  subtitle: "subtitle",
  variant: "default",
};

export const Header = DefaultStory.bind({});
Header.args = {
  title: "Element1",
  variant: "header",
};

export const Available = DefaultStory.bind({});
Available.args = {
  title: "Element1",
  variant: "available",
};

export const Closed = DefaultStory.bind({});
Closed.args = {
  title: "Element1",
  variant: "closed",
};

export const Scheduled = DefaultStory.bind({});
Scheduled.args = {
  title: "Element1",
  variant: "scheduled",
};

export const Progress = DefaultStory.bind({});
Progress.args = {
  title: "Element1",
  variant: "default",
  hasProgress: true,
};
