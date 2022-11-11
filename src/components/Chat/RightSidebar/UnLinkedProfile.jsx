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
  Select,
  MenuItem,
} from "@material-ui/core";
import { TextInputField, InputDialog } from "./";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilRoot,
} from "recoil";
import { chatProfileStatusAtom } from "../recoilStates";
import { fuzzyDate, personNameShort } from "../../utils/format";

// TODO: linked user link

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  temporaryStyling: {
    margin: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
}));

export const UnLinkedProfile = ({}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <Typography className={classes.temporaryStyling}>
        This conversation is not linked to a profile.
      </Typography>
      <Link href="#" className={classes.temporaryStyling}>
        LINK TO PROFILE{" "}
      </Link>
    </Card>
  );
};
