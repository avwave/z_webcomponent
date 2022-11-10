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
  Switch,
  Chip,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useState, useReducer } from "react";
import AddIcon from "@material-ui/icons/Add";
import { fuzzyDate, personNameShort } from "../../utils/format";
import { TextInputField, InputDialog } from "./";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    "& .MuiCardHeader-root": { paddingBottom: 0 },
    "& .MuiCardContent-root": { paddingTop: 0},
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
  tagsDialogContentContainer: {
    display: "flex",
    flexDirection: "column",
    paddingRight: theme.spacing(8),
    paddingLeft: theme.spacing(8),
  },
  tagSwitchContainer: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: theme.spacing(2),
  },
  switchTitle: { textAlign: "center", fontWeight: "bold" },
  chipContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
    borderColor: theme.palette.primary.main,
  },
}));

export const TagsDialogContent = ({ tagList, tags, handleToggle }) => {
  const classes = useStyles();

  return (
    <Box className={classes.tagsDialogContentContainer}>
      {tags.map((tag) => (
        <Box className={classes.tagSwitchContainer} key={tag?.tag}>
          <Tooltip title={tag?.description}>
            <Typography className={classes.switchTitle}>
              {tag?.label}
            </Typography>
          </Tooltip>
          <FormControlLabel
            className={classes.controlLabel}
            value={tag?.tag}
            checked={tag?.checked}
            control={<Switch color="primary" />}
            onChange={(e) => handleToggle(e, tag)}
            labelPlacement="top"
          />
        </Box>
      ))}
    </Box>
  );
};

export const Tags = ({
  title = "Tags",
  handleOpenAdd,
  handleAddOnChange,
  tagList,
  children,
  tags,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [openAdd, setOpenAdd] = useState(false);

  return (
    <Card className={classes.root}>
      <CardHeader
        disableTypography
        action={
          <CardActions disableSpacing>
            <InputDialog
              title="Change Tags"
              edge="end"
              open={openAdd}
              tooltipTitle="Change Tags"
              iconButton={<EditIcon />}
              handleAccept={() =>
                handleOpenAdd(openAdd, setOpenAdd)
              }
              handleClose={() =>
                handleOpenAdd(openAdd, setOpenAdd)
              }
              handleClickOpen={() =>
                handleOpenAdd(openAdd, setOpenAdd)
              }
              dialogContent={children}
            />
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
        <CardContent>
          {tagList && (
            <div className={classes.chipContainer}>
              {tagList.map((tag, i) => {
                if (tag.deleted === false) {
                  let tooltipTitle;
                  let chipLabel;
                  tags.filter((obj) => {
                    if (obj.tag === tag.tag) {
                      tooltipTitle = obj.description;
                      chipLabel = obj.label;
                    }
                  });

                  return (
                    <li key={tag.tag}>
                      <Tooltip title={tooltipTitle}>
                        <Chip
                          variant="outlined"
                          label={chipLabel}
                          className={classes.chip}
                        />
                      </Tooltip>
                    </li>
                  );
                }
              })}
            </div>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};
