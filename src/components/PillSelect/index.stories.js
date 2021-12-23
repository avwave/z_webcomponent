import React from "react";
import { PillSelect } from "./PillSelect";


const PillSelectStory = {
  component: PillSelect,
  title: "PillSelect",
  argTypes: {
    color: {
      control: {
        type: "select",
        options: ["primary", "secondary", "error", "warning", "info", "success"],
      },
    },
  },
};

export default PillSelectStory;

const DefaultStory = ({...args}) => (
  <PillSelect {...args}/>
);

export const Default = DefaultStory.bind({});
Default.args = {
  label: "Default Label",
  badgeContent: "999999",
  variant: "default"

}
