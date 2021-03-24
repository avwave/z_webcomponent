import React from "react";
import StateButton from "./StateButton";

export default {
  title: "Button",
  component: StateButton,
};

const Template = (args) => <StateButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  text: 'Primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  text: 'Secondary',
};

export const Success = Template.bind({});
Success.args = {
  color: 'success',
  text: 'Success',
};

export const Danger = Template.bind({});
Danger.args = {
  color: 'danger',
  text: 'Danger',
};

export const Warning = Template.bind({});
Warning.args = {
  color: 'warning',
  text: 'Warning',
};

export const Info = Template.bind({});
Info.args = {
  color: 'info',
  text: 'Info',
};