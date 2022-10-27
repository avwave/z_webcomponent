import { Schedules } from "./Schedules";

export default {
  title: "Chat/Schedules",
  component: Schedules,
};

export const Default = (args) => {
  return <Schedules {...args} />;
};

Default.args = {
  title: "Schedules",
  preferedSchedule: "There are no prefered schedules.",
  matchedSchedule: " There are no matched schedules.",
};
