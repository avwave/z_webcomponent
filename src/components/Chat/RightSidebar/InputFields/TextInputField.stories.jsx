import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { TextInputField } from "./TextInputField";
import { values } from "idb-keyval";

export default {
  title: "Chat/InputFields/TextInputField",
  component: TextInputField,
};

export const Default = (args) => {
  const [value, setValue] = useState("");

  const handleOnChange = (e) => {
    setValue(e.target.value);
  };
  return <TextInputField {...args} value={value} onChange={handleOnChange} />;
};

Default.args = {
  label: "Label",
};
