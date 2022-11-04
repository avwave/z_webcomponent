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
import clsx from "clsx";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { fuzzyDate, personNameShort } from "../../utils/format";
import { TextInputField, InputDialog } from "./";


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    "& .MuiCardHeader-root": { paddingBottom: 0 },
    "& .MuiCardContent-root": { paddingTop: 0 },
    "& .MuiCardContent-root": { paddingRight: 0 },

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

export const NoteItem = ({
  title = "Info",
  note,
  handleOpenEdit,
  handleOpenDelete,
  handleAcceptEdit,
  handleAcceptDelete,
  handleEditOnChange
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [value, setValue] = useState("");


  return (
    <ListItem key={note?.id}>
      <ListItemText
        primary={note.content}
        secondary={`- ${personNameShort(note.owner)} | ${fuzzyDate(
          note.last_updated
        )}`}
      />

      <InputDialog
        title="Edit"
        edge="end"
        open={openEdit}
        iconButton={<EditIcon />}
        handleAccept={() => handleAcceptEdit(note, openEdit, setOpenEdit, value)}
        handleClose={() => handleOpenEdit(note, openEdit, setOpenEdit, value)}
        handleClickOpen={() => handleOpenEdit(note, openEdit, setOpenEdit, value)}
        dialogContent={ <TextInputField
          label="Note"
          value={value}
          onChange={(e) => handleEditOnChange(e, value, setValue)}
        />}
      />

      <InputDialog
        title="Delete"
        edge="end"
        open={openDelete}
        acceptButtonText="Delete"
        tooltipTitle="Delete"
        iconButton={<DeleteIcon />}
        handleAccept={() => handleAcceptDelete(note, openDelete, setOpenDelete)}
        handleClose={() => handleOpenDelete(note, openDelete, setOpenDelete)}
        handleClickOpen={() =>
          handleOpenDelete(note, openDelete, setOpenDelete)
        }
        dialogContent={<Typography>Are you sure you want to delete this note?</Typography>}
      />
    </ListItem>
  );
};

export const Notes = ({
  title = "Info",
  noteList,
  editDialog,
  deleteDialog,
  handleOpenEdit,
  handleOpenDelete,
  handleOpenAdd,
  handleAcceptEdit,
  handleAcceptDelete,
  handleAcceptAdd,
  handleEditOnChange,
  handleAddOnChange
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);



  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [openAdd, setOpenAdd] = useState(false);
 const [value, setValue] = useState("");


  return (
    <Card className={classes.root}>
      <CardHeader
        disableTypography
        action={
          <CardActions disableSpacing>
            <InputDialog
              title="Add"
              edge="end"
              open={openAdd}
              tooltipTitle="Add"
              iconButton={<AddIcon />}
              handleAccept={() => handleAcceptAdd(openAdd, setOpenAdd)}
              handleClose={() => handleOpenAdd(openAdd, setOpenAdd)}
              handleClickOpen={() => handleOpenAdd(openAdd, setOpenAdd)}
              dialogContent={ <TextInputField
                label="Note"
                value={value}
                onChange={(e) => handleAddOnChange(e, value, setValue)}
              />}
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
        <CardContent>{noteList.map((note) => (
    <NoteItem
      note={note}
      handleOpenEdit={handleOpenEdit}
      handleOpenDelete={handleOpenDelete}
      handleAcceptEdit={handleAcceptEdit}
      handleAcceptDelete={handleAcceptDelete}
      handleEditOnChange={handleEditOnChange}
    />
  ))}</CardContent>
      </Collapse>
    </Card>
  );
};
