import React from "react";
import Checkbox, { status } from "./Checkbox";

import { action, actions } from "@storybook/addon-actions";

const CheckboxStory = {
  component: Checkbox,
  title: "Checkbox",
};

export default CheckboxStory;

export const Default = () => (
  <Checkbox
    item={{ id: "1", title: "Checkbox 1", state: status.UNCHECKED }}
    onToggle={action("onToggle(id)")}
  />
);

export const Checked = () => (
  <Checkbox
    item={{
      id: "1",
      title: "Checkbox 1",
      state: status.CHECKED,
    }}
    onToggle={action("onToggle(id)")}
  />
);
