import { ClickAwayListener, makeStyles, Paper, Popper } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { TimeSelect } from './TimeSelect';

const useStyles = makeStyles((theme) => {
  return {
    overlay:{
      zIndex: theme.zIndex.tooltip + 1
    }
  }
})

const CustomPicker = ({ value, onChange, open, anchorEl, onClose }) => {
  const classes = useStyles()
  return open ? (
    <ClickAwayListener onClickAway={onClose}>
      <Popper open={open} anchorEl={anchorEl} placement="bottom-start"
      className={classes.overlay}
      >
        <Paper className="picker">
          <TimeSelect value={value} onChange={onChange} />
        </Paper>
      </Popper>
    </ClickAwayListener>
  ) : null;
};

export {CustomPicker}