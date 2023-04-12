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

  const onChange = React.useCallback(
    (ev) => {
      if (typeof onChangeProp !== "function") return;
      onChangeProp(ev.target.value);
    },
    [onChangeProp]
  );

  return (
    <TextField
      {...otherProps}
      value={value}
      onChange={(evt) => {
        onChangeProp(evt.target.value);
      }}
    />
  );
}

export { CriteriaTextField }