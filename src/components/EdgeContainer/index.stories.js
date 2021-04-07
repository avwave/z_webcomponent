import { Box, Typography } from "@material-ui/core";
import React from "react";
import { EdgeContainer } from ".";

const EdgeContainerStory = {
  component: EdgeContainer,
  title: "EdgeContainer",
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: [
          "primary",
          "secondary",
          "error",
          "warning",
          "info",
          "success",
        ],
      },
    },
    edgePadding: {
      control: {
        type: "range",
        min: 0,
        max: 50,
        step: 1,
      },
    },
    edgeWidth: {
      control: {
        type: "range",
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 5,
      },
    },
    edgeColor: {
      control: {
        type: "color",
      },
    },
    backgroundColor: {
      control: {
        type: "color",
      },
    },
  },
};

export default EdgeContainerStory;

const DefaultStory = ({ ...args }) => (
  <div style={{ width: "300px", height: "150px" }}>
    <EdgeContainer {...args}>
      <Typography>{args.title}</Typography>
    </EdgeContainer>
  </div>
);

export const Default = DefaultStory.bind({});
Default.args = {
  title: "Edge Container",
  clear: true
};

export const Variant = DefaultStory.bind({});
Variant.args = {
  ...Default.args,
  variant: "secondary",
};


