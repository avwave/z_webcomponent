import React, { useState, useRef } from "react";
import {
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
  Typography,
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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  mainTypeSelect: {
    marginRight: theme.spacing(4),
  },
  secondaryTypeSelect: { minWidth: theme.spacing(14) },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export const InputDialog = ({
  dialogContent,
  title,
  acceptButtonText = "Save",
  cancelButtonText = "Cancel",
  open,
  handleAccept,
  handleClose,
  handleClickOpen,
  tooltipTitle = "Edit",
  iconButton = <EditIcon />,
  edge= "",
}) => {
  const classes = useStyles();

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <IconButton edge={edge} aria-label="edit" color="primary" onClick={handleClickOpen}>
          {iconButton}
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {title}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {cancelButtonText}
          </Button>
          <Button onClick={handleAccept} color="primary">
            {acceptButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
