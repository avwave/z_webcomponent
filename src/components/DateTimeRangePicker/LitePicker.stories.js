import React from "react";

import { action, actions } from "@storybook/addon-actions";
import { DateTimeRangePicker } from ".";
import ReactJson from "react-json-view";
import {useState} from '../DataGrid2/stateref';

const DatePickerStory = {
  component: DateTimeRangePicker,
  title: "DateTimeRangePicker",
};

export default DatePickerStory;

export const DefaultStory = ({...args}) => {
  const [values, setValues] = useState();

  return <div>
    <ReactJson src={values}/>
    <DateTimeRangePicker {...args} 
      onChange={v=>setValues(v)}/>
  </div>
};

export const Default = DefaultStory.bind({});
Default.args = {
  inline: false
};
