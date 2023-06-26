import { useGeolocation } from "./useGeolocation";
import ReactJson from "react-json-view";

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
