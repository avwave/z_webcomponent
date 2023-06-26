import { makeStyles } from 'tss-react/mui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Lottie from "react-lottie-player";
import mapAnimation from './mapanim.json'
import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
const useStyles = makeStyles()(theme => ({
}));
const useGeolocation = ({ highAccuracy = true, enabled = true }) => {
  const { classes } = useStyles()
  const [error, setError] = useState(null);
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);
  const [isGeolocationPermissionDismissed, setIsGeolocationPermissionDismissed] = useState(true);

  const [latLng, setLatLng] = useState(null);

  useEffect(
    () => {
      setIsGeolocationPermissionDismissed(navigator.geolocation)
    }, [navigator.geolocation]
  );

  const setIfDisplayDialog = useCallback(
    (result) => {
      if (result?.state === 'granted') {
        setIsGeolocationPermissionDismissed(true)
      } else if (result?.state === 'prompt') {
        setIsGeolocationPermissionDismissed(false)
      } else if (result?.state === 'denied') {
        setIsGeolocationPermissionDismissed(false)
      }
    },
    [],
  );

  useEffect(
    () => {
      if (navigator?.permissions?.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          setIfDisplayDialog(result)
          result.onchange = (result) => {
            setIfDisplayDialog(result?.target)
          }
        })
      } else {
        setIsGeolocationPermissionDismissed(false)
      }
    }, []
  );

  const dialog = useMemo(
    () => {
      if (enabled && !isGeolocationPermissionDismissed) {
        return <Dialog open={!isGeolocationPermissionDismissed} onClose={() => setIsGeolocationPermissionDismissed(true)}>
          <DialogContent sx={{display:'flex', flexDirection:'column', textAlign:'center', alignItems:'center'}}>
            <Lottie
              loop
              animationData={mapAnimation}
              play
              style={{ width: 400, height: 400 }}
            />
            <Typography variant="h6">Please enable location services so we can roughly estimate your address</Typography>
          </DialogContent>
          <DialogActions sx={{justifyContent:'center'}}>
            <Button variant="contained" color="primary" onClick={() => setIsGeolocationPermissionDismissed(true)}>OK</Button>
          </DialogActions>
        </Dialog>
      }
    }, [enabled, isGeolocationPermissionDismissed]
  );

  const updateCoordinates = useCallback(
    ({ coords, timestamp }) => {
      setLatLng({ lat: coords.latitude, lng: coords.longitude })
    },
    [],
  );

  const setErrorCallback = useCallback(
    (e) => {
      setError(e?.message)
      setIsGeolocationPermissionDismissed(false)
    },
    [],
  );


  useEffect(
    () => {
      let watchID
      if (enabled) {
        navigator?.geolocation?.getCurrentPosition(updateCoordinates, setErrorCallback)
        watchID = navigator?.geolocation?.watchPosition(
          updateCoordinates,
          setErrorCallback,
          {
            enableHighAccuracy: highAccuracy,
            maximumAge: 15000,
          }
        )
      }
      return () => {
        if (watchID) {
          navigator?.geolocation?.clearWatch(watchID)
        }
      }
    }, [enabled, highAccuracy, setErrorCallback, updateCoordinates]
  );

  return {
    dialog,
    error,
    isGeolocationEnabled,
    latLng,
  }
}

export { useGeolocation }