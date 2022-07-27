import moment from "moment";
import React from "react";
import { WeekPicker } from ".";

const WeekPickerStory = {
  component: WeekPicker,
  title: "WeekPicker",
  argTypes: {
    color: {
      control: {
        type: "select",
        options: ["primary", "secondary", "error", "warning", "info", "success"],
      },
    },
  },
};

export default WeekPickerStory;

const DefaultStory = ({ ...args }) => (
  <WeekPicker {...args} />
);

export const Default = DefaultStory.bind({});
Default.args = {
  labelStyle: { fontSize: '1.5rem' },
  onChange: (range) => {
    alert(JSON.stringify(range, null, 2));
  }
}

export const SetValue = DefaultStory.bind({});
SetValue.args = {
  ...Default.args,
  value: moment('2007-08-02').toDate(),
}


export const MonthPicker = DefaultStory.bind({});
MonthPicker.args = {
  ...Default.args,
  asMonthPicker: true,

}