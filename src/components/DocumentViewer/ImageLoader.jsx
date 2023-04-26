import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState } from 'react';
import { PanViewer } from 'react-image-pan-zoom-rotate';

const useStyles = makeStyles()(theme => ({
  rootContainer:{
    position:'relative',
    overflow:'hidden'
  },
  thumb:{
    maxWidth:80,
    width:'auto',
    height:80,
  }
}));
const ImageLoader = ({
  file,
  scale,
  onReset,
  asThumbnail = false,
}) => {
  const { classes } = useStyles()
  const [dx, setDx] = React.useState(0);
  const [dy, setDy] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [flip, setFlip] = React.useState(false);

  const resetAll = () => {
    setDx(0);
    setDy(0);
    setZoom(1);
    setRotation(0);
    setFlip(false);
  };
  const zoomIn = () => {
    setZoom(zoom + 0.2);
  };

  const zoomOut = () => {
    if (zoom >= 1) {
      setZoom(zoom - 0.2);
    }
  };

  const rotateLeft = () => {
    if (rotation === -3) {
      setRotation(0);
    } else {
      setRotation(rotation - 1);
    }
  };

  const flipImage = () => {
    setFlip(!flip);
  };

  const onPan = (dx, dy) => {
    setDx(dx);
    setDy(dy);
  };

  useEffect(
    () => {
      if (scale === 1) {
        resetAll();
      }
    }, [scale, onReset]
  );

  if (asThumbnail) {
    return <img className={classes.thumb} src={file?.url||file?.data} alt={file?.fileName} />;
  }

  return (
    <div className={classes.rootContainer}>
      <PanViewer
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}
        zoom={scale}
        pandx={dx}
        pandy={dy}
        onPan={onPan}
        rotation={rotation}
        key={dx}
      >
        <img
          style={{
            transform: `rotate(${rotation * 90}deg) scaleX(${flip ? -1 : 1})`,
            width: '100%',
          }}
          src={file?.url || file?.data}
          alt={file?.fileName}
        />
      </PanViewer>
    </div>
  );
}

export { ImageLoader }