import { Avatar, Chip, makeStyles } from '@material-ui/core';
import { PropertyKeys } from 'ag-grid-community';
import React, { useEffect, useMemo, useState } from 'react';

const useStyles = makeStyles((theme) => {
  return {
    root:{
      flexFlow: 'row-reverse',
      paddingRight: theme.spacing(1),

    },
    avatar: {
      width:'auto !important',
      minWidth: '1em !important',
      borderRadius: '1em/50%',
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem',
    },
    label: {

    }
  }
})
const PillSelect = ({ label, onClick = () => { }, badgeContent, ...rest }) => {
  const classes = useStyles()
  return (
    <Chip
      classes={{
        root: classes.root,
        avatar: classes.avatar,
        label: classes.label,
      }}
      
      label={label}
      onClick={() => onClick()}
      avatar={<Avatar>{badgeContent}</Avatar>}
      variant="outlined"
      
      {...rest}
    />
  )
}

export { PillSelect }