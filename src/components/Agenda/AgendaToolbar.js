import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { ButtonGroup } from "@material-ui/core";
import { Navigate } from "react-big-calendar";
import clsx from "clsx";

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
}) {
  const classes = useStyles();

  const viewNamesGroup = (messages) => {
    if (views.length > 1) {
      return views.map((name) => (
        <Button
          type="button"
          key={name}
          color={view === name ? "primary" : "inherit"}
          onClick={() => onView(name)}
        >
          {messages[name]}
        </Button>
      ));
    }
  };

  return (
    <div className={classes.root}>
      <Toolbar>
        <ButtonGroup
          variant="text"
          size="small"
          className={classes.leftGroup}
        >
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
        <Typography variant="h6" className={classes.title}>
          {label}
        </Typography>
        <ButtonGroup
          variant="text"
          size="small"
          className={classes.rightGroup}
        >
          {viewNamesGroup(localizer.messages)}
        </ButtonGroup>
      </Toolbar>
    </div>
  );
}