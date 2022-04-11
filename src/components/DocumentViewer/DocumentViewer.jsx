import { makeStyles, CircularProgress } from '@material-ui/core';
import React, { useMemo } from 'react';
import FilePreviewer, { FilePreviewerThumbnail } from 'react-file-previewer';
import "react-file-previewer/src/styles.css";
import "./styles.scss";
import mime from 'mime-types';

const useStyles = makeStyles((theme) => {
  return {
    documentContainer: {
      minHeight: "calc(100vh - 88px) !important",
      width: '100%',
      backgroundColor:'#68738a',
      display: 'flex',
      alignItems: "center",
    justifyContent: "space-around",
    },
    center:{

    }
  }
})
const DocumentViewer = ({
  url,
  data,
  mimeType = "image/*",
  downloadName = "download",
  asThumbnail = false,
  loading = false
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
      {loading ? (
        <CircularProgress className={classes.center}/>
      ) : (
        <FilePreviewer
          file={file}
        />
      )
      }
    </div>

  )
}

export { DocumentViewer };
