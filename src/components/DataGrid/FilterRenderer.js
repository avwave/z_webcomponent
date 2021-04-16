import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import React from "react";
import { Close } from "@material-ui/icons";

function TextFilterRenderer({ onChange, value }) {
  return (
    <Input
      placeholder="Filter"
      onChange={(e) => onChange(e.target.value)}
      value={value}
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
  );
}

function OptionFilterRenderer({ onChange, value, filter }) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{filter.label}</InputLabel>
      <Select
        fullWidth
        defaultValue={""}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value=""><em>None</em></MenuItem>
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
