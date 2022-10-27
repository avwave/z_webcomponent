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
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import {fuzzyDate, personNameShort} from '../../utils/format'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    '& .MuiCardHeader-root': {paddingBottom: 0},
    '& .MuiCardContent-root': {paddingTop: 0}
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  cardTitle: { fontWeight: "600" },
}));

export const Notes = ({ title = "Info", noteList }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const mappedNoteList = noteList.map((note) => (
    <ListItem>
      <ListItemText
        primary={note.content}
        secondary={`- ${personNameShort(note.owner)} | ${fuzzyDate(note.last_updated)}`}
      />
      <IconButton edge="end">
        <EditIcon />
      </IconButton>
      <IconButton edge="end">
        <DeleteIcon />
      </IconButton>
    </ListItem>
  ));

  return (
    <Card className={classes.root}>
      <CardHeader
        disableTypography
        action={
          <CardActions disableSpacing>
            <IconButton>
              <AddIcon />
            </IconButton>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
        }
        title={<Typography className={classes.cardTitle}> {title} </Typography>}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>{mappedNoteList}</CardContent>
      </Collapse>
    </Card>
  );
};
