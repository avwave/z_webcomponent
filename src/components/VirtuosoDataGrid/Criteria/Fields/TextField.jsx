import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState } from 'react';
import { TextField } from '@mui/material';

const useStyles = makeStyles()(theme => ({
}));
const CriteriaTextField = ({
  value,
  label,
  type = "text",
  gutterBottom = false,
  onChange: onChangeProp,
  ...otherProps
}) => {
  const { classes } = useStyles()

  return (
    <TextField
      {...otherProps}
      autoComplete='default-search-field'
      inputProps={
        {
          autoComplete: 'default-search-field',
          type: 'search',
        }
      }
      variant='outlined'
      InputLabelProps={{
        shrink: true,
      }}
      label={label}
      value={value}
      fullWidth
      onChange={(evt) => {
        onChangeProp(evt.target.value);
      }}
    />
  );
}

export { CriteriaTextField }