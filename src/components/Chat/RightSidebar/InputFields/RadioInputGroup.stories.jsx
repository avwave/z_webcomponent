import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { RadioInputGroup } from "./RadioInputGroup";

export default {
  title: "Chat/InputFields/RadioInputGroup",
  component: RadioInputGroup,
};

const Template = (args) => {
  const [value, setValue] = useState();

  const handleOnChange = (e) => {
    setValue(e.target.value);
  };

  return <RadioInputGroup {...args} value={value} onChange={handleOnChange} />;
};

export const Default = Template.bind({});

Default.args = {
  title: "Title",
  options: [
    { value: "value", displayValue: "label" },
    { value: "value2", displayValue: "label2" },
    { value: "value3", displayValue: "label3" },
  ],
};
