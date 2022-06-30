import { AppBar, LinearProgress, makeStyles, Toolbar, Typography } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';

const useStyles = makeStyles((theme) => {
  return {
    appBar: {
      top: 'auto',
      bottom: 0,
    },
    grow: {
      flexGrow: 1,
    },
  }
})
const Stepper = ({
  steps,
  activeStep,
  nextButton,
  backButton,
  stepperProps
}) => {
  const classes = useStyles()

  const normalValue = useMemo(
    () => {
      const value = activeStep + 1
      const normalise = value * 100 / (steps);
      return normalise
    }, [activeStep, steps]
  );
  const offsetValue = useMemo(
    () => {
      const value = activeStep
      const normalise = value * 100 / (steps -1);
      return normalise
    }, [activeStep, steps]
  );

  return (
    <AppBar position="static"
      color={stepperProps?.color ?? "secondary"}
      className={classes.appBar}
      elevation={0}
    >
      <Toolbar variant={stepperProps?.isDense ? "dense" : "regular"}>
        {backButton}

        {stepperProps?.variant === 'progress' ?
          (
            <LinearProgress className={classes.grow} color={stepperProps?.progressColor} variant='determinate' value={offsetValue} />
          )
          :
          (
            <>
              <div className={classes.grow} />
              <Typography variant="caption" color="inherit">{stepperProps?.prefix} {activeStep + 1} of {steps}</Typography>
              <div className={classes.grow} />
            </>
          )
        }


        {nextButton}
      </Toolbar>
      {stepperProps?.variant === 'progress' ? <></> :
        <LinearProgress color={stepperProps?.progressColor} variant='determinate' value={normalValue} />
      }
    </AppBar >
  )
}

export { Stepper }