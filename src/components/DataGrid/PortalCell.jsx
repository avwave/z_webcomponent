import { IconButton, makeStyles, Popover, Portal } from '@material-ui/core';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const useStyles = makeStyles((theme) => {
  return {
    portalCell: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "relative",
      height: "100%"
    },
    portal: {
      padding: theme.spacing(1),
      maxHeight: '300px'
    }
  }
})
const PortalCell = ({ expandCell, renderedCell }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null);

  const show = Boolean(anchorEl);
  return (
    <div className={classes.portalCell}>
      <Popover
        open={show}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className={classes.portal}>
          {expandCell}
        </div>
      </Popover>
      {renderedCell}
      <IconButton size="small" onClick={(event) => {
        setAnchorEl(event.currentTarget);
      }}>{show ? <ArrowDropUp /> : <ArrowDropDown />}</IconButton>
    </div>
  )
}

export { PortalCell }