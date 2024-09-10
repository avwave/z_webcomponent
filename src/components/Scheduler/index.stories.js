import React, { useState } from "react";

import { Card, CardContent, Divider, Typography } from "@mui/material";
import { SchedulerUI, SchedulerSelector } from ".";
import ReactJson from "react-json-view";


export default {
  title: "Scheduler",
  component: SchedulerUI,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["primary", "secondary", "error", "warning", "info", "success"],
      },
    },
  },
};

const Template = (args) => {
  const [schedule, setSchedule] = useState(null);
  return (
    <>
      <SchedulerUI
        {...args}
        onChange={(schedule) => setSchedule(schedule)}
      />

      <Card>
        <CardContent>
          <ReactJson src={schedule} />

        </CardContent>
      </Card>
    </>

  )
}

export const Default = Template.bind({});
Default.args = {
  size: 'small',

};

export const OneTime = Template.bind({});
OneTime.args = {
  ...Default.args,
  editable: true,
  frequency: null,
  scheduled_time: new Date().toISOString()
};

export const SetValueMonthly = Template.bind({});
SetValueMonthly.args = {
  ...Default.args,
  editable: true,
  frequency: 'monthly',
  day: 15,
  hour: 12,
  minute: 30,
  second: 0,
};

export const SetValueWeekly = Template.bind({});
SetValueWeekly.args = {
  ...Default.args,
  editable: true,
  frequency: 'weekly',
  day_of_week: 2,
  hour: 12,
  minute: 30,
  second: 0,
};

export const SetValueDaily = Template.bind({});
SetValueDaily.args = {
  ...Default.args,
  editable: true,
  frequency: 'daily',
  hour: 12,
  minute: 30,
  second: 0,
};

export const SetValueHourly = Template.bind({});
SetValueHourly.args = {
  ...Default.args,
  editable: true,
  frequency: 'hourly',
  minute: 30,
  second: 0,
};



