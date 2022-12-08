import { Button, IconButton, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
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
    galleryInfo: {

    }
  }
})
const DocumentGallery = ({ docs = [], initialIndex=0 }) => {
  const classes = useStyles()
  const [currentFileIndex, setCurrentFileIndex] = useState(initialIndex);
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState();

  useEffect(() => {
    if (docs.length > 0) {
      setCurrentFileIndex(initialIndex);
    }
  }, [docs.length, initialIndex]);

  useEffect(() => {
    const process = async () => {
      setLoading(true);
      let data = docs[currentFileIndex]?.data
      if (docs[currentFileIndex]?.dataCallback) {
        const callbackfn = docs[currentFileIndex].dataCallback
        data = await callbackfn()
      }
      setFileData(data)
      setLoading(false);
    }
    process()
  }, [currentFileIndex, docs]);

  if (isEmpty(docs)) {
    return <></>
  }

  return (
    <div className={clsx(classes.navigationContainer, 'pvx-container')}>
      <div className={clsx(classes.galleryInfo, 'preview-bar')}>
        <IconButton
          color="inherit"
          onClick={() => { setCurrentFileIndex(currentFileIndex === 0 ? 0 : currentFileIndex - 1) }}
          size="large"><ArrowBackIos /></IconButton>
        <Typography style={{ flex: 1 }} variant="caption">{docs[currentFileIndex]?.displayName ?? docs[currentFileIndex]?.name}</Typography>
        <Typography variant="caption">{currentFileIndex + 1} of {docs.length}</Typography>
        <IconButton
          color="inherit"
          onClick={() => { setCurrentFileIndex(currentFileIndex === (docs.length - 1) ? docs.length - 1 : currentFileIndex + 1) }}
          size="large"><ArrowForwardIos /></IconButton>
      </div>
      <DocumentViewer loading={loading} downloadName={docs[currentFileIndex]?.name} data={fileData} mimeType={docs[currentFileIndex]?.mimeType} url={docs[currentFileIndex]?.url} />
      <IconButton
        onClick={() => { setCurrentFileIndex(currentFileIndex === 0 ? 0 : currentFileIndex - 1) }}
        className={classes.previous}
        size="large"><ArrowBackIos /></IconButton>
      <IconButton
        onClick={() => { setCurrentFileIndex(currentFileIndex === (docs.length - 1) ? docs.length - 1 : currentFileIndex + 1) }}
        className={classes.next}
        size="large"><ArrowForwardIos /></IconButton>
    </div>
  );
}

export { DocumentGallery }