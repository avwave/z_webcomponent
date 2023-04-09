import moment from "moment";
const now = new Date();

const filledDay = () => {
  return [...Array(11).keys()].map((key) => {
    return {
      id: `fill-${key}`,
      title: `FillEvent-${key}`,
      start: moment().add(-1, "d").startOf("day").hour(key).toDate(),
      end: moment()
        .add(-1, "d")
        .startOf("day")
        .hour(key + 1)
        .toDate(),
    };
  });
};

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
];

const daySummary = [
  { date: moment().startOf("month").toDate(), summary: { status: "INC" } },
  {
    date: moment().startOf("day").toDate(),
    summary: { status: "PENDING" },
  },
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
      height: "2em",
    },
  },
  ...filledDay(),
];

const progressEvents = baseEvents.map((event) => {
  if (event.id.toString().startsWith("fill")) {
    event.progress = (Math.floor(Math.random() * 10) + 1) * 10;
    event.variant = "primary";
  } else if (event.id === 0) {
    event.progress = 70;
  }

  return event;
});

const evtStartdate = moment().startOf("day").hour(8);
const evtEndDate = moment().startOf("day").hour(8).add(12, "h");
const evt2Startdate = moment().add(1, "d").startOf("day").hour(8);
const evt2EndDate = moment().add(1, "d").startOf("day").hour(8).add(12, "h");
const resourceList = [
  {
    id: 4,
    name: "COVID_ANTIBODY_LAB",
    title: "COVID-19 Antibody Lab Test",
    icon_url:
      "https://dnjqko642wsuu.cloudfront.net/events/service_antibody_lab.png",
  },
  {
    id: 2,
    name: "COVID_ANTIBODY_POC",
    title: "COVID-19 Antibody Rapid Test",
    icon_url:
      "https://dnjqko642wsuu.cloudfront.net/events/service_antibody_poc.png",
  },
  {
    id: 3,
    name: "COVID_ANTIGEN_POC",
    title: "COVID-19 Antigen Rapid Test",
    icon_url:
      "https://dnjqko642wsuu.cloudfront.net/events/service_antigen_poc.png",
  },
  {
    id: 5,
    name: "COVID_PCR_LAB",
    title: "COVID-19 RT-PCR Lab Test",
    icon_url: "https://dnjqko642wsuu.cloudfront.net/events/service_pcr.png",
  },
  {
    id: 6,
    name: "COVID_VACCINATION",
    title: "COVID-19 Vaccination",
    icon_url: "https://dnjqko642wsuu.cloudfront.net/events/service_vax.png",
  },
  {
    id: 7,
    name: "FLU_VACCINATION",
    title: "Flu Vaccination",
    icon_url: "https://dnjqko642wsuu.cloudfront.net/events/service_vax.png",
  },
];
const resourceEvents = [
  {
    id: 1,
    title: "Day Event Today",
    start: evtStartdate.toDate(),
    end: evtEndDate.toDate(),
    slots: [
      {
        id: "1-0",
        title: "1-8am slot rec1",
        start: evtStartdate.startOf("day").hour(8).toDate(),
        end: evtStartdate.startOf("day").hour(9).toDate(),
        resourceId: 4,
      },
      {
        id: "1-1",
        title: "1-8am slot rec2",
        start: evtStartdate.startOf("day").hour(8).toDate(),
        end: evtStartdate.startOf("day").hour(9).toDate(),
        resourceId: 2,
      },
      {
        id: "1-2",
        title: "1-1030am slot rec2",
        start: evtStartdate.startOf("day").hour(10).toDate(),
        end: evtStartdate.startOf("day").hour(12).toDate(),
        resourceId: 2,
      },
      {
        id: "2-0",
        title: "2-8am slot rec1",
        start: evtStartdate.startOf("day").hour(13).toDate(),
        end: evtStartdate.startOf("day").hour(14).toDate(),
        resourceId: 4,
      },
      {
        id: "2-1",
        title: "2-8am slot rec2",
        start: evtStartdate.startOf("day").hour(14).toDate(),
        end: evtStartdate.startOf("day").hour(15).toDate(),
        resourceId: 5,
      },
      {
        id: "2-2",
        title: "2-1030am slot rec2",
        start: evtStartdate.startOf("day").hour(11).toDate(),
        end: evtStartdate.startOf("day").hour(12).toDate(),
        resourceId: 2,
      },
    ],
  },
];

export {
  resourceEvents,
  resourceList,
  baseEvents,
  heightBugEvents,
  daySummary,
  progressEvents,
};
