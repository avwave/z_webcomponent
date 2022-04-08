import { makeStyles } from '@material-ui/core';
import React, { useMemo } from 'react';
import FilePreviewer, { FilePreviewerThumbnail } from 'react-file-previewer';
import "react-file-previewer/src/styles.css";
import "./styles.scss";
import mime from 'mime-types';

const useStyles = makeStyles((theme) => {
  return {
    documentContainer: {
      
    }
  }
})
const DocumentViewer = ({
  url,
  data,
  mimeType = "image/*",
  downloadName = "download",
  asThumbnail = false,
}) => {
  const classes = useStyles()

  const file = useMemo(() => {
    let file = {
      mimeType,
      name: downloadName,
    }

    if (data) {
      file = { ...file, data }
    } else if (url) {
      const hrefparse = document.createElement('a')
      hrefparse.href = url
      const contentType = mime.lookup(hrefparse.pathname);
      file = { ...file, mimeType: contentType, url }
    }
    return file
  }, [data, downloadName, mimeType, url]);


  if (asThumbnail) {
    return (
      <FilePreviewerThumbnail
        file={file}
      />
    )
  }
  return (
    <div className={classes.documentContainer}>
      <FilePreviewer
        file={file}
      />
    </div>

  )
}

export { DocumentViewer };
