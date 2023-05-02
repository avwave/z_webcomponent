import React from 'react'
import { makeStyles } from 'tss-react/mui';
const useStyles = makeStyles()(theme => ({
  root: theme => ({
    height: '1px',
    border: 'none',
    margin: '1em 0',
    backgroundColor: theme.palette.grey[300]
  })
}));

function Divider () {
  const { classes } = useStyles()

  return (
    <hr className={classes.root} />
  )
}

export default React.memo(Divider)
