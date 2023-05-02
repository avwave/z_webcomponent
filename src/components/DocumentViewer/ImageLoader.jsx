import React from 'react';
import { makeStyles } from 'tss-react/mui';
import PinchZoomPan from './PinchZoomPan';

const useStyles = makeStyles()(theme => ({
  rootContainer: {
    position: 'relative',
    overflow: 'hidden'
  },
  thumb: {
    maxWidth: 80,
    width: 'auto',
    height: 80,
  }
}));
const ImageLoader = ({
  file,
  scale,
  onReset,
  asThumbnail = false,
}) => {
  const { classes } = useStyles()


  if (asThumbnail) {
    return <img className={classes.thumb} src={file?.url || file?.data} alt={file?.fileName} />;
  }

  return (
    <PinchZoomPan
      doubleTapBehavior="zoom"
      minScale={.1}
      maxScale={2}
    >
      <img src={file?.url || file?.data} alt={file?.fileName} />
    </PinchZoomPan>
  )
}

export { ImageLoader };
