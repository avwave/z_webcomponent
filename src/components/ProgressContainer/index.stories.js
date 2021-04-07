import { Typography } from "@material-ui/core";
import React from "react";
import { ProgressContainer } from ".";

const ProgressContainerStory = {
  component: ProgressContainer,
  title: "ProgressContainer",
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["primary", "secondary", "error", "warning", "info", "success"],
      },
    },
  },
};

export default ProgressContainerStory;

const DefaultStory = ({...args}) => (
  <ProgressContainer {...args}>
    <Typography>{args.progress} %</Typography>
  </ProgressContainer>
);

export const Default = DefaultStory.bind({});
Default.args = {
  progress: 75,
}

export const Variant = DefaultStory.bind({});
Variant.args = {
  progress: 75,
  variant: "secondary",
};