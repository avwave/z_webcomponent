import { Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState } from 'react';

const useStyles = makeStyles()((theme) => {
  return {
    active: {
      
    },
    inactive: {

    }
  }
});
const SelectOption = ({value, onClick, isActive}) => {
  const { classes } = useStyles()
  return (
    <Button 
      onClick={onClick}
      className={isActive ? classes.active : classes.inactive}
      variant={isActive ? "contained" : "text"}
      color={isActive ? "primary" : "default"}

    >
      {value}
    </Button>
  )
}

export {SelectOption}