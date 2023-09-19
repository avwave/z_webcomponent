import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState } from 'react';
import { Typography } from '@mui/material';

const useStyles = makeStyles()(theme => ({
}));
const NewComponent = ({title, subtitle, color}) => {
  const { classes } = useStyles()
  return (
    <Typography variant="h1" component="div" color={color} gutterBottom>
      {title}
      <Typography variant="h2" gutterBottom>
        {subtitle}
      </Typography>
    </Typography>
  )
}

export { NewComponent }