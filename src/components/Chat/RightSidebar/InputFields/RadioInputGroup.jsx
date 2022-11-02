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

export const RadioInputGroup = ({ title, value, onChange, options }) => {
  const optionsToRender = options.map((option) => (
    <FormControlLabel
      value={option.value}
      control={<Radio />}
      label={option.displayValue}
      key={option.value}
    />
  ));

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{title}</FormLabel>
      <RadioGroup value={value} onChange={onChange}>
        {optionsToRender}
      </RadioGroup>
    </FormControl>
  );
};

RadioInputGroup.propTypes = {
  title: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
};
