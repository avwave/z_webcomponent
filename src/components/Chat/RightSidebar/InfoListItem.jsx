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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import { InputDialog } from "./InputDialog";
import clsx from "clsx";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useState } from "react";


const useStyles = makeStyles((theme) => ({
  listContainer: {
    display: "flex",
    alignItems: "center",
  },
  labelContainer: {
    paddingRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: "600",
  },
}));

export const InfoListItem = ({ label, value, inputDialog }) => {
  const classes = useStyles();


  return (
    <Box className={classes.listContainer}>
    {inputDialog}
      <Box className={classes.labelContainer}>
        <Typography className={classes.labelText}>
          {label}:
        </Typography>
      </Box>
      <Typography> {value} </Typography>
    </Box>
  );
};

