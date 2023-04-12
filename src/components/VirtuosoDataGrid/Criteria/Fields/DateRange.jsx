import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import { LitePicker } from '../../../DateTimeRangePicker/wrapper';


const useStyles = makeStyles()(theme => ({
}));
const CriteriaDateRange = ({
  value,
  label,
  onChange: onChangeProp,
  ...otherProps
}) => {
  const { classes } = useStyles()
  return (
      <LitePicker label="Date range"
        inline
        variant="outlined"
        value={value}
        immediate
        onCancel={() => {
          
        }}
        onValueChange={(val) => {
          onChangeProp(val)
        }} />
    
  )
}

export { CriteriaDateRange }