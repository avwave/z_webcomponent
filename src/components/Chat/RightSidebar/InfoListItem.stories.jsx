import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { InfoListItem } from "./InfoListItem";
import { TextInputField } from "./InputFields/TextInputField";
import { InputDialog } from "./InputDialog";

export default {
  title: "Chat/InfoListItem",
  component: InfoListItem,
};

export const ListItem = (args) => {
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
    <InfoListItem
      inputDialog={
        <InputDialog
          title="Title"
          open={open}
          handleAccept={handleAccept}
          handleClose={handleClose}
          handleClickOpen={handleClickOpen}
          dialogContent={
            <TextInputField
              label="Label"
              value={value}
              onChange={handleOnChange}
            />
          }
        />
      }
      {...args}
    />
  );
};

ListItem.args = {
  label: "Field Label",
  value: "Field Value",
};
