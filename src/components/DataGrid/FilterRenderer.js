import {
  IconButton,
  Input,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import React from "react";
import { Cancel, Visibility, Close } from "@material-ui/icons";

export function TextFilterRenderer({ onChange, value }) {
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
