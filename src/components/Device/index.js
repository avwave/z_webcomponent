import * as RDD from 'react-device-detect';
import { browserVersion, deviceDetect, isDesktop, isMobile, mobileModel, mobileVendor, useMobileOrientation } from 'react-device-detect';

const MobileView = (props) => <RDD.MobileView renderWithFragment {...props} />
const BrowserView = (props) => <RDD.BrowserView renderWithFragment {...props} />
const IOSView = (props) => <RDD.IOSView renderWithFragment {...props} />
const AndroidView = (props) => <RDD.AndroidView renderWithFragment {...props} />

const browserName = RDD.browserName

const deviceData = {
  browserName: RDD.browserName,
  browserVersion,
  mobile: {
    mobileVendor,
    mobileModel,
  },
  ...deviceDetect()
}
export { deviceData, isMobile, isDesktop, useMobileOrientation, browserName, MobileView, BrowserView, IOSView, AndroidView };

