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
import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import { fuzzyDate, personNameShort } from "../../utils/format";
import { TextInputField, InputDialog } from "./";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilRoot,
} from "recoil";
import { noteListAtom, conversationIdAtom } from "../recoilStates";
import { ChatService } from "../chatService";


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    "& .MuiCardHeader-root": { paddingBottom: 0 },
    "& .MuiCardContent-root": { paddingTop: 0, paddingRight: 0 },
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
  handleEditOnChange,
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
        handleAccept={() =>
          handleAcceptEdit(note, openEdit, setOpenEdit, value, setValue)
        }
        handleClose={() =>
          handleOpenEdit(note, openEdit, setOpenEdit, value, setValue)
        }
        handleClickOpen={() =>
          handleOpenEdit(note, openEdit, setOpenEdit, value, setValue)
        }
        dialogContent={
          <TextInputField
            label="Note"
            value={value}
            onChange={(e) => handleEditOnChange(e, value, setValue)}
          />
        }
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
        dialogContent={
          <Typography>Are you sure you want to delete this note?</Typography>
        }
      />
    </ListItem>
  );
};

export const Notes = ({
  conversationId,
  noteList,
  setNoteList,
  title = "Info",
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ChatService.getConversationNotes(conversationId);
        console.log(response);
        setNoteList(response?.data?.list);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData().catch(console.error);
  }, [conversationId]);

  const handleOpenEdit = (note, open, setOpen) => {
    // console.log("note", note);
    // console.log("open", open);
    // console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleAcceptEdit = (note, open, setOpen) => {
    // console.log("note", note);
    // console.log("open", open);
    // console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleOpenDelete = (note, open, setOpen) => {
    // console.log("note", note);
    // console.log("open", open);
    // console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleAcceptDelete = (note, open, setOpen) => {
    // console.log("note", note);
    // console.log("open", open);
    // console.log("setopen", setOpen);
    setNoteList((prevState) =>
      prevState.filter((notes) => notes.id !== note.id)
    );
    setOpen(!open);
  };

  const handleEditOnChange = (e, value, setValue) => {
    // console.log("e", e);
    // console.log("value", value);
    // console.log("setvalue", setValue);
    setValue(e.target.value);
  };

  const handleAddOnChange = (e, value, setValue) => {
    // console.log("e", e);
    // console.log("value", value);
    // console.log("setvalue", setValue);
    setValue(e.target.value);
  };

  const handleOpenAdd = (open, setOpen) => {
    // console.log("open", open);
    // console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleAcceptAdd = (open, setOpen) => {
    // console.log("open", open);
    // console.log("setopen", setOpen);
    setOpen(!open);
  };

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
              handleAccept={() =>
                handleAcceptAdd(openAdd, setOpenAdd, value, setValue)
              }
              handleClose={() =>
                handleOpenAdd(openAdd, setOpenAdd, value, setValue)
              }
              handleClickOpen={() =>
                handleOpenAdd(openAdd, setOpenAdd, value, setValue)
              }
              dialogContent={
                <TextInputField
                  label="Note"
                  value={value}
                  onChange={(e) => handleAddOnChange(e, value, setValue)}
                />
              }
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
          {noteList.map((note) => (
            <NoteItem
              note={note}
              handleOpenEdit={handleOpenEdit}
              handleOpenDelete={handleOpenDelete}
              handleAcceptEdit={handleAcceptEdit}
              handleAcceptDelete={handleAcceptDelete}
              handleEditOnChange={handleEditOnChange}
            />
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};
