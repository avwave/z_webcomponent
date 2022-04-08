import { Button, IconButton, makeStyles, Typography } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import clsx from 'clsx';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DocumentViewer } from '../DocumentViewer';

const useStyles = makeStyles((theme) => {
  return {
    navigationContainer: {
      position: 'relative',
    },
    previous: {
      position: 'absolute',
      left: 0,
      top: '50%'
    },
    next: {
      position: 'absolute',
      right: 0,
      top: '50%'
    },
    galleryInfo:{
      
    }
  }
})
const DocumentGallery = ({ docs = [] }) => {
  const classes = useStyles()
  const [currentFileIndex, setCurrentFileIndex] = useState(null);

  const [fileData, setFileData] = useState();

  useEffect(() => {
    if (docs.length > 0) {
      setCurrentFileIndex(0);
    }
  }, []);

  useEffect(() => {
    const process = async () => {
      let data = docs[currentFileIndex]?.data
      if (docs[currentFileIndex]?.dataCallback) {
        const callbackfn = docs[currentFileIndex].dataCallback
        data = await callbackfn()
      }
      setFileData(data)
    }
    process()
  }, [currentFileIndex, docs]);

  if (isEmpty(docs)) {
    return <></>
  }

  return (
    <div className={classes.navigationContainer}>
      <div className={clsx(classes.galleryInfo, 'preview-bar')}>
        <IconButton color="inherit" onClick={() => { setCurrentFileIndex(currentFileIndex === 0 ? 0 : currentFileIndex - 1) }} ><ArrowBackIos /></IconButton>
        <Typography style={{flex:1}}variant="caption">{docs[currentFileIndex]?.displayName??docs[currentFileIndex]?.name}</Typography>
        <Typography variant="caption">{currentFileIndex + 1} of {docs.length + 1}</Typography>
        <IconButton color="inherit" onClick={() => { setCurrentFileIndex(currentFileIndex === (docs.length - 1) ? docs.length - 1 : currentFileIndex + 1) }} ><ArrowForwardIos /></IconButton>
      </div>
      <DocumentViewer downloadName={docs[currentFileIndex]?.name} data={fileData} mimeType={docs[currentFileIndex]?.mimeType} url={docs[currentFileIndex]?.url} />
      <IconButton onClick={() => { setCurrentFileIndex(currentFileIndex === 0 ? 0 : currentFileIndex - 1) }} className={classes.previous}><ArrowBackIos /></IconButton>
      <IconButton onClick={() => { setCurrentFileIndex(currentFileIndex === (docs.length - 1) ? docs.length - 1 : currentFileIndex + 1) }} className={classes.next}><ArrowForwardIos /></IconButton>
    </div>
  )
}

export { DocumentGallery }