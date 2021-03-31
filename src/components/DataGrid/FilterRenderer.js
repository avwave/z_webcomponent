import { TextField } from "@material-ui/core";
import React from "react";

export function TextFilterRenderer({ onChange, value }) {
  return (
    <TextField
      label="Filter"
      onChange={(e) => onChange(e.target.value)}
      value={value}
    />
  );
}
