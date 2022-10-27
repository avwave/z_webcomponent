import React, { useState } from "react";
import {
  Typography,
  Backdrop,
  CircularProgress,
  LinearProgress,
  Toolbar,
  Tooltip,
  withStyles,
  makeStyles,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Box,
  DialogTitle,
  Dialog,
  Button,
  InputLabel,
  FormControl,
  DialogContent,
  DialogActions,
  TextField,
  ListItem,
  ListItemText,
  List,
  ListItemIcon,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  CardMedia,
  CardActions,
  Collapse,
  Link,
} from "@material-ui/core";

// TODO: UPDATE STATUS DIALOG ON STATUS CLICK

// TODO: STATUS UPDATED BY DESCRIPTION

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  avatar: { marginRight: theme.spacing(2) },
  avatarSection: { display: "flex", alignItems: "center", padding: theme.spacing(2) },
  avatarSectionTextWrapper: {},
  profileName: { fontWeight: "600" },
  profileLink: {},
  statusSection:{padding: theme.spacing(2) }
}));

export const LinkedProfile = ({
  profileName,
  profileLink,
  profileLinkText = "View the profile",
  status_label,
  avatarLink,
  avatarAlt
}) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <Box className={classes.avatarSection}>
        <Avatar alt={avatarAlt} src={avatarLink} className={classes.avatar}/>
        <Box className={classes.avatarSectionTextWrapper}>
          <Typography className={classes.profileName}>{profileName}</Typography>
          <Link href={profileLink} className={classes.profileLink}>
            {profileLinkText}
          </Link>
        </Box>
      </Box>
      <Box className={classes.statusSection}>
        <Typography>{status_label}</Typography>
      </Box>
    </Card>
  );
};
