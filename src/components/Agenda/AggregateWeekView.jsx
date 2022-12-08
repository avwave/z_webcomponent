import { makeStyles } from 'tss-react/mui';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import TimeGrid from 'react-big-calendar/lib/TimeGrid';

import { navigate } from 'react-big-calendar/lib/utils/constants';

import * as dates from 'react-big-calendar/lib/utils/dates'

import ReactJson from "react-json-view";

const useStyles = makeStyles()((theme) => {
  return {}
});
const AggregateWeekView = (cProps) => {
  const { classes } = useStyles()

  let {
    date,
    events,
    ...props
  } = cProps
  let range = AggregateWeekView.range(date, cProps)

  const groupedEvents = useMemo(
    () => {

      const result = events
        .sort((a, b) => {
          return a.start - b.end;
        })
        .reduce((acc, curr) => {
          const isoStr = moment(curr.start).toISOString() + ':' + moment(curr.end).toISOString();
          const subarray = acc[isoStr]?.events;
          if (subarray) {
            subarray.push(curr);
            acc[isoStr].events = subarray;
          } else{
            acc[isoStr] = {
              start: curr.start,
              end: curr.end,
              id: isoStr,
              events: [curr],
              variant: 'success',
              bgColor: '#f0f',
              textColor: '#000',
              evtStyle: {
                backgroundColor: "transparent",
                color: '#000',
              },
            };
          }
          return acc;
        }, [])
      return Object.values(result)
    }, [events]
  );


  return (
    <>
      {/* <ReactJson src={groupedEvents} collapsed={1}/> */}
      <TimeGrid {...props}
        events={groupedEvents}
        range={range}
        eventOffset={15} />
    </>
  )
}

AggregateWeekView.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -1, 'week')

    case navigate.NEXT:
      return dates.add(date, 1, 'week')

    default:
      return date
  }
}

AggregateWeekView.range = (date, { localizer }) => {
  let firstOfWeek = localizer.startOfWeek()
  let start = dates.startOf(date, 'week', firstOfWeek)
  let end = dates.endOf(date, 'week', firstOfWeek)

  return dates.range(start, end)
}

AggregateWeekView.title = (date, props) => {
  return "AGRREGATE WEEK VIEW"
}

export { AggregateWeekView }