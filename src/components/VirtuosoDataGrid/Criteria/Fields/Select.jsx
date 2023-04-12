import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState } from 'react';
import { FormControl, MenuItem, MenuList, Select } from '@mui/material';

const useStyles = makeStyles()(theme => ({
}));
const CriteriaSelect = ({ 
  value,
  label,
  options=[],
  gutterBottom = false,
  onChange: onChangeProp,
  ...otherProps
}) => {
  const { classes } = useStyles()
  return (
    <FormControl variant="standard" fullWidth className={classes.formControl}>
      <MenuList
        fullWidth
      >
        <MenuItem value=""
          onClick={() => onChangeProp(null)}
        >
          Any
        </MenuItem>
        {options.map((option, idx) => (
          <MenuItem
            key={idx}
            value={option.value}
            selected={value === option.value}
            onClick={() => onChangeProp(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </FormControl>
  )
}

export { CriteriaSelect }