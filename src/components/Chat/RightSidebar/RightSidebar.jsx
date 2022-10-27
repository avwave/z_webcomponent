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
  Paper,
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
  root: {
    maxWidth: 345,
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight * 2.5}px)`,
  },
  profileWrapper: { height: "20%" },
  cardTitle: { fontWeight: "600" },
  scrollableSectionWrapper: { height: "80%", overflowY: "auto" },
}));

export const RightSidebar = ({ children, profileSection }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <Box className={classes.profileWrapper}>{profileSection}</Box>
      <Box className={classes.scrollableSectionWrapper}>
        <Box>{children}</Box>
      </Box>
    </Card>
  );
};
