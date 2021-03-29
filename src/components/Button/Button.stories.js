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
  disabled:false
}

export const DisabledButton = DefaultStory.bind({})
DisabledButton.args = {
  title: "Button1",
  variant: "primary",
  disabled: true,
};

export const PrimaryButton = DefaultStory.bind({})
PrimaryButton.args = {
  title:'Button1',
  variant: 'primary',
}
export const SecondaryButton = DefaultStory.bind({})
SecondaryButton.args = {
  title:'Button1',
  variant: 'secondary',
}
export const SuccessButton = DefaultStory.bind({})
SuccessButton.args = {
  title:'Button1',
  variant: 'success',
}
export const DangerButton = DefaultStory.bind({})
DangerButton.args = {
  title:'Button1',
  variant: 'danger',
}
export const WarningButton = DefaultStory.bind({})
WarningButton.args = {
  title:'Button1',
  variant: 'warning',
}
export const InfoButton = DefaultStory.bind({})
InfoButton.args = {
  title:'Button1',
  variant: 'info',
}