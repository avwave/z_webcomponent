import React from "react";
import { action, actions } from "@storybook/addon-actions";
import { Button } from ".";

const ButtonStory = {
  component: Button,
  title: "Button",
};

export default ButtonStory;

const DefaultStory = ({ ...args }) => (
  <Button {...args} onClick={action("Button onClick")} />
);
export const Default = DefaultStory.bind({})
Default.args = {
  title:'Button1',
  outlined: false,
  disabled:false
}

const OutlinedStory = ({...args}) => (
  <Button {...args} onClick={action("Button onClick")} />
);
export const Outlined = OutlinedStory.bind({})
Outlined.args = {
  title:'Button1',
  outlined: true,
  disabled:false
}
const DisabledStory = ({...args}) => (
  <Button {...args} onClick={action("Button onClick")} />
);
export const Disabled = DisabledStory.bind({})
Disabled.args = {
  title:'Button1',
  outlined: false,
  disabled:true
}