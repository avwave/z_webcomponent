import { Notes } from "./Notes";

export default {
  title: "Chat/Notes",
  component: Notes,
};

export const Default = (args) => {
  return <Notes {...args} />;
};

Default.args = {
  title: "Notes",
  noteList: [
    {
      id: 35,
      owner: {
        id: 854,
        first_name: "Denzel",
        last_name: "Deogracias",
        type: "staff",
      },
      conversation: {
        id: 2281,
        source: { id: 1 },
        channel: "RECRUITMENT",
      },
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu",
      date_created: "2019-12-05T03:41:39Z",
      last_updated: "2019-12-05T03:41:39Z",
    },
    {
      id: 36,
      owner: {
        id: 854,
        first_name: "Denzel",
        last_name: "Deogracias",
        type: "staff",
      },
      conversation: {
        id: 2281,
        source: { id: 1 },
        channel: "RECRUITMENT",
      },
      content: "Comment",
      date_created: "2019-12-05T06:34:21Z",
      last_updated: "2019-12-05T06:34:21Z",
    },
    {
      id: 37,
      owner: {
        id: 854,
        first_name: "Denzel",
        last_name: "Deogracias",
        type: "staff",
      },
      conversation: {
        id: 2281,
        source: { id: 1 },
        channel: "RECRUITMENT",
      },
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      date_created: "2019-12-05T06:43:10Z",
      last_updated: "2019-12-05T06:43:10Z",
    },
    {
      id: 40,
      owner: {
        id: 854,
        first_name: "Denzel",
        last_name: "Deogracias",
        type: "staff",
      },
      conversation: {
        id: 2281,
        source: { id: 1 },
        channel: "RECRUITMENT",
      },
      content: "gwa",
      date_created: "2019-12-05T07:03:41Z",
      last_updated: "2019-12-06T03:32:19Z",
    },
    {
      id: 41,
      owner: {
        id: 854,
        first_name: "Denzel",
        last_name: "Deogracias",
        type: "staff",
      },
      conversation: {
        id: 2281,
        source: { id: 1 },
        channel: "RECRUITMENT",
      },
      content: "pvc",
      date_created: "2019-12-05T07:24:22Z",
      last_updated: "2019-12-05T07:40:17Z",
    },
  ],
};
