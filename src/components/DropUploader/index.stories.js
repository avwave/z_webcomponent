import { Typography } from "@mui/material";
import React from "react";
import { DropUploader } from ".";

const DropUploaderStory = {
  component: DropUploader,
  title: "DropUploader",
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
  },
};

export default DropUploaderStory;

const DefaultStory = ({ ...args }) => <DropUploader {...args} />;

export const Default = DefaultStory.bind({});
Default.args = {
  progress: 75,
};

export const Variant = DefaultStory.bind({});
Variant.args = {
  progress: 75,
  variant: "secondary",
};
