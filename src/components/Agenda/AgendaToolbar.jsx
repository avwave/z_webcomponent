import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Navigate } from "react-big-calendar";
import { Button, ButtonGroup, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  leftGroup: {
    flexGrow: 1,
  },
  rightGroup: {},
  title: {
    flexGrow: 1,
  },
}));

export default function AgendaToolbar({
  date,
  view,
  views,
  label,
  localizer,
  onNavigate,
  onView,
  resources, 
  ...props
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Toolbar>
        {!resources ?
        <ButtonGroup variant="text" size="small" className={classes.leftGroup}>
          <Button
            type="button"
            onClick={() => onNavigate(Navigate.TODAY, date)}
          >
            {localizer.messages.today}
          </Button>
          <Button
            type="button"
            onClick={() => onNavigate(Navigate.PREVIOUS, date)}
          >
            {localizer.messages.previous}
          </Button>
          <Button type="button" onClick={() => onNavigate(Navigate.NEXT, date)}>
            {localizer.messages.next}
          </Button>
        </ButtonGroup>
      : <Typography variant="overline" className={classes.leftGroup}>{" "}</Typography>}
        <Typography variant="h6" className={classes.title}>
          {label}
        </Typography>
        <ButtonGroup variant="text" size="small" className={classes.rightGroup}>
          {views?.map((viewItem, idx) => (
            <Button
              type="button"
              key={`view-${idx}`}
              color={view === viewItem ? "primary" : "inherit"}
              onClick={() => onView(viewItem)}
            >
              {localizer.messages[viewItem]}
            </Button>
          ))}
        </ButtonGroup>
      </Toolbar>
    </div>
  );
}
