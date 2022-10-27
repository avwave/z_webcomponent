import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { InputDialog } from "./InputDialog";
import { RadioInputGroup } from "./InputFields/RadioInputGroup";
import { TextInputField } from "./InputFields/TextInputField";

export default {
  title: "Chat/InputDialog",
  component: InputDialog,
};

export const WithTextInput = () => {
  const [value, setValue] = useState("");

  const handleOnChange = (e) => {
    setValue(e.target.value);
  };

  const [open, setOpen] = useState(false);

  const handleAccept = (e) => {
    setOpen(false);
  };

  const handleClose = (e) => {
    setOpen(false);
  };

  const handleClickOpen = (e) => {
    setOpen(true);
  };

  return (
    <InputDialog
      title="Title"
      open={open}
      handleAccept={handleAccept}
      handleClose={handleClose}
      handleClickOpen={handleClickOpen}
      dialogContent={
        <TextInputField label="Label" value={value} onChange={handleOnChange} />
      }
    />
  );
};

export const WithRadioGroup = () => {
  const [value, setValue] = useState("");

  const handleOnChange = (e) => {
    setValue(e.target.value);
  };

  const options = [
    { value: "value", label: "label" },
    { value: "value2", label: "label2" },
    { value: "value3", label: "label3" },
  ];

  const [open, setOpen] = useState(false);

  const handleAccept = (e) => {
    setOpen(false);
  };

  const handleClose = (e) => {
    setOpen(false);
  };

  const handleClickOpen = (e) => {
    setOpen(true);
  };

  return (
    <InputDialog
      title="Title"
      open={open}
      handleAccept={handleAccept}
      handleClose={handleClose}
      handleClickOpen={handleClickOpen}
      dialogContent={
        <RadioInputGroup
          options={options}
          title="Title"
          value={value}
          onChange={handleOnChange}
        />
      }
    />
  );
};
