import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { NumberInputField } from "./NumberInputField";
import { values } from "idb-keyval";

export default {
  title: "Chat/InputFields/NumberInputField",
  component: NumberInputField,
};

export const Default = (args) => {
  const [value, setValue] = useState();
  const handleOnChange = (e) => {
    setValue(e.target.value);
  };

  return <NumberInputField {...args} value={value} onChange={handleOnChange} />;
};

Default.args = {
  label: "Label",
};
