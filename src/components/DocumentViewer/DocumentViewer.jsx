import { CircularProgress } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import React, { useMemo } from 'react';
import FilePreviewer, { FilePreviewerThumbnail } from 'react-file-previewer';
import "react-file-previewer/src/styles.css";
import "./styles.scss";
import mime from 'mime-types';
import * as base64Utils from 'base64-utils'

const useStyles = makeStyles()((theme) => {
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
});
const DocumentViewer = ({
  url,
  data,
  mimeType = "image/*",
  downloadName = "download",
  asThumbnail = false,
  loading = false
}) => {
  const { classes } = useStyles()

  const file = useMemo(() => {
    let file = {
      mimeType,
      name: downloadName,
    }

    if (data) {
      const magicNumberSlice = data.slice(0, 16)
      const mimeType = base64Utils.getMimeType(magicNumberSlice)
      file = { ...file, mimeType, data }
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
