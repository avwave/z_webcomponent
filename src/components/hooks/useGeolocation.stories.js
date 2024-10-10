import { Button } from "@mui/material";
import { useGeolocation } from "./useGeolocation";
import ReactJson from "react-json-view";
import { useState } from "react";

const useGeolocationStory = {
  title: "Hooks/useGeolocation",
};

export default useGeolocationStory;

export const Default = ({ ...args }) => {
  const {
    dialog,
    error,
    isGeolocationEnabled,
    latLng
  } = useGeolocation(args);

  return (
    <>
      {dialog}
      <ReactJson src={{ error, isGeolocationEnabled, latLng }} />
    </>
  )
};

Default.args = {};

const DisablePeriodicUpdates = Default.bind({});
DisablePeriodicUpdates.args = {
  watchLocation: false
};

export const ManualUpdate = ({ ...args }) => {
  const {
    dialog,
    error,
    isGeolocationEnabled,
    latLng,
    fetchNewLocation
  } = useGeolocation({ watchLocation: false });

  const [location, setLocation] = useState({});
  return (
    <>
      {dialog}
      <ReactJson src={{ error, location }} />
      <Button onClick={async () => {
        const newLoc = await fetchNewLocation()
        setLocation(newLoc)
      }}>
        Update Location
      </Button>
    </>
  )
}