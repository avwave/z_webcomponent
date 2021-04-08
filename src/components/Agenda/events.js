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
    end: moment("2020-05-12T08:32:23.000Z").toDate(),
    variant: "info",
    description:
      "Minima voluptatem ut et veritatis repellat. Dolores veniam est. Nesciunt ipsam dignissimos provident. Et illum asperiores et totam consequatur et praesentium dolores. Magni est atque voluptatem consequatur qui doloremque. Repellendus nam voluptatem dolore est suscipit et laborum sint veniam.",
  },
  {
    id: 1,
    title: "2h Event First of Month",
    start: moment().startOf("month").hour(14).toDate(),
    end: moment().startOf("month").hour(16).toDate(),
    variant: "success",
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
    variant: "warning",
  },
  {
    id: 4,
    title: "AM Event Today",
    start: moment().startOf("day").hour(8).toDate(),
    end: moment().startOf("day").hour(12).toDate(),
  },
  ...filledDay(),
  {
    id: 6,
    title: "Spanning",
    start: moment().startOf("week").add(4, "d").hour(8).toDate(),
    end: moment().startOf("week").add(6, "d").hour(12).toDate(),
    variant: "error",
  },
];

const daySummary = [
  { date: moment().startOf("month").toDate(), summary: { status: "INC" } },
  { date: moment().startOf("day").toDate(), summary: { status: "PENDING" } },
  {
    date: moment().add(1, "d").startOf("day").toDate(),
    summary: { status: "FULL" },
  },
  {
    date: moment().add(3, "d").startOf("day").toDate(),
    summary: { status: "FREE" },
  },
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

const progressEvents = baseEvents.map(event => {
  if (event.id.toString().startsWith("fill")) {
    event.progress = (Math.floor(Math.random() * 10) + 1) * 10;
    event.variant = "primary"
  } else if (event.id === 0){
    event.progress = 70;
  }

  return event;
});

export {baseEvents, heightBugEvents, daySummary, progressEvents};
