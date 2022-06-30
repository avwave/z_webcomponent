import { AppBar, LinearProgress, makeStyles, Toolbar, Typography } from '@material-ui/core';
import clsx from 'clsx';
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
    progress: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
    }
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
      const normalise = value * 100 / (steps - 1);
      return normalise
    }, [activeStep, steps]
  );

  return (
    <AppBar position="static"
      color={stepperProps?.color ?? "secondary"}
      className={classes.appBar}
      elevation={0}
    >
      <Toolbar
        variant={stepperProps?.isDense ? "dense" : "regular"}
        disableGutters
      >

        {backButton}

        {stepperProps?.variant === 'progress' ?
          (
            <LinearProgress className={clsx(classes.grow, classes.progress)} color={stepperProps?.progressColor} variant='determinate' value={offsetValue} />
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