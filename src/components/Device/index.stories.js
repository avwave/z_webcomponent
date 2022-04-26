import ReactJson from "react-json-view";
import {deviceData, isMobile, isDesktop, 
  useMobileOrientation, 
  browserName, 
  MobileView, 
  BrowserView, 
  IOSView,
  AndroidView
} from './index'

const DeviceInfoStory = {
  title: "DeviceInfo",
};

export default DeviceInfoStory;

export const Default = () => {
  return <ReactJson src={{
    deviceData,
    isMobile,
    isDesktop,
  }} />;
};


export const Visibility = () => {
  return <>
    <MobileView><div>Visible in mobile</div></MobileView>
    <BrowserView><div>Visible in browser</div></BrowserView>
    <IOSView><div>Visible in IOS</div></IOSView>
    <AndroidView><div>Visible in Android</div></AndroidView>
  </>
};

export const Orientation = () => {
  const {isPortrait, isLandscape} = useMobileOrientation()

  return <ReactJson src={{
    isPortrait,
    isLandscape
  }} />;
};