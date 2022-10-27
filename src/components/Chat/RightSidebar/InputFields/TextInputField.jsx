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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";

export const TextInputField = ({ label, refValue, value, onChange }) => {
  return (
    <TextField
      fullWidth
      name="Text Input"
      label={label}
      inputRef={refValue}
      value={value}
      onChange={onChange}
    />
  );
};

TextInputField.propTypes = {
  label: PropTypes.string,
  refValue: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
