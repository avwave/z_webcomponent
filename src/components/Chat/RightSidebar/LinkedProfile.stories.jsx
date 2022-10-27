import { LinkedProfile } from "./LinkedProfile";

export default {
  title: "Chat/LinkedProfile",
  component: LinkedProfile,
};

export const Default = (args) => {

  return <LinkedProfile {...args} />;
};

Default.args = {
profileName: "Patricia Ann Trinidad",
profileLink: "#",
profileLinkText: "View the profile",
status_label:  "Recruiting - Scheduling Interview",
};
