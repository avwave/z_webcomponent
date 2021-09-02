import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function TextFilterRenderer({ onChange, value, filter }) {
  const classes = useStyles();
  return (
    <FormControl fullWidth className={classes.formControl}>
      <InputLabel>{filter?.label}</InputLabel>
      <Input
        onChange={(e) => onChange(e.target.value)}
        value={value ?? ""}
        endAdornment={
          value ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="close"
                size="small"
                onClick={() => onChange("")}
              >
                <Close />
              </IconButton>
            </InputAdornment>
          ) : null
        }
      />
    </FormControl>
  );
}

function OptionFilterRenderer({ onChange, value, filter }) {
  const classes = useStyles();
  return (
    <FormControl fullWidth className={classes.formControl}>
      <InputLabel>{filter?.label}</InputLabel>
      <Select
        fullWidth
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {filter.options.map((option, idx) => (
          <MenuItem key={idx} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    
  );
}

export { TextFilterRenderer, OptionFilterRenderer };
