import moment from 'moment'
const now = new Date();

const filledDay = () => {
  return [...Array(11).keys()].map((key) => {
    return {
      id: `fill-${key}`,
      title: `FillEvent-${key}`,
      start: moment().add(1, "d").startOf("day").hour(key).toDate(),
      end: moment()
        .add(1, "d")
        .startOf("day")
        .hour(key + 1)
        .toDate(),
    };
  });
}

const baseEvents = [
  {
    id: 0,
    title: "1h Event First of Month",
    start: moment().startOf("month").hour(13).toDate(),
    end: moment().startOf("month").hour(14).toDate(),
  },
  {
    id: 1,
    title: "2h Event First of Month",
    start: moment().startOf("month").hour(14).toDate(),
    end: moment().startOf("month").hour(16).toDate(),
  },
  {
    id: 2,
    title: "1h Event Today",
    start: moment().startOf("day").hour(13).toDate(),
    end: moment().startOf("day").hour(14).toDate(),
  },
  {
    id: 3,
    title: "2h Event Today",
    start: moment().startOf("day").hour(14).toDate(),
    end: moment().startOf("day").hour(16).toDate(),
    evtStyle: {
      backgroundColor: "#ffffcc",
      color: "#333",
    },
  },
  {
    id: 4,
    title: "AM Event Today",
    start: moment().startOf("day").hour(8).toDate(),
    end: moment().startOf("day").hour(12).toDate(),
  },
  ...filledDay(),
];

const heightBugEvents = [
  {
    id: 2,
    title: "1h Event Today",
    start: moment().startOf("day").hour(13).toDate(),
    end: moment().startOf("day").hour(14).toDate(),
  },
  {
    id: 3,
    title: "2h Event Today",
    start: moment().startOf("day").hour(14).toDate(),
    end: moment().startOf("day").hour(16).toDate(),
    evtStyle: {
      backgroundColor: "#ffffcc",
      color: "#333",
    },
  },
  {
    id: 4,
    title: "AM Event Today",
    start: moment().startOf("day").hour(8).toDate(),
    end: moment().startOf("day").hour(12).toDate(),
    evtStyle: {
      height: "2em"
    },
  },
  ...filledDay(),
];

export {baseEvents, heightBugEvents};
