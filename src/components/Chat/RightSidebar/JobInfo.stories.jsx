import { JobInfo } from "./JobInfo";

export default {
  title: "Chat/JobInfo",
  component: JobInfo,
};

export const Default = (args) => {
  return <JobInfo {...args} />;
};

Default.args = {
  title: "JobInfo",
  jobsInfo:{
    "employee_id": 980,
    "date_created": "2020-04-17T05:35:49Z",
    "date_first_activated": "2020-04-17T05:36:00Z",
    "jobs_finished": 0
  },
};
