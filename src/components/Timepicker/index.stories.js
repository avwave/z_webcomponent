import { Paper } from "@material-ui/core";
import moment from "moment";
import React, { useState } from "react";
import { Timepicker } from "./Timepicker";


const TimepickerStory = {
  title: "Time Picker",
  component: Timepicker
};

export default TimepickerStory

export const Primary = () => {
  const [time, setTime] = useState();
  return (
    <Timepicker
      value={time}
      onChange={setTime}
      labelText="Select Time"
    />
  );
};

export const Fullwidth = () => {
  const [time, setTime] = useState();
  return (
    <Paper style={{ width: "100%" }}>
      <Timepicker
        value={time}
        onChange={setTime}
        labelText="Select Time"
        inputProps={{ fullWidth: true }}
      />
    </Paper>
  );
}

export const Variant = () => {
  const [time, setTime] = useState();
  return (
    <Paper style={{ width: "100%" }}>
      <Timepicker
        value={time}
        onChange={setTime}
        labelText="Select Time"
        inputProps={{ variant: 'outlined' }}
      />
    </Paper>
  );
}

export const PredefinedTime = () => {
  const [time, setTime] = useState(moment().add(4, 'hours'));
  return (
    <Timepicker
      value={time}
      onChange={setTime}
      labelText="Select Time"
      fullWidth
    />
  );
}