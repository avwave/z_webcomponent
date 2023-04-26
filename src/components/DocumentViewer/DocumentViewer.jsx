import { makeStyles } from 'tss-react/mui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import mime from 'mime-types';
import saveFile from 'file-saver';

import { useIntersectionObserver } from "@wojtekmaj/react-hooks";

import clsx from 'clsx';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { Document, Page, pdfjs } from 'react-pdf';
import { getMimeType } from './base64utils';
import { Alert, LinearProgress } from '@mui/material';
import { useElementSize } from 'usehooks-ts';
import { DocumentOverlayControl, DocumentToolbar } from './DocumentToolbar';
import { ImageLoader } from './ImageLoader';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;



const useStyles = makeStyles()((theme) => {
  return {
    root:{
      backgroundColor: theme.palette.grey[700],
    },
    documentContainer: {
      overflow: 'scroll',
      height: 'calc(100vh - 66px)',
    },
    documentThumbnail: {
      width: 80,
      height: 80,
    },
    rootContainer: {
      position: 'relative'
    }
  }
});


const DocumentViewer = ({
  url,
  data,
  mimeType = "image/*",
  downloadName = "download",
  asThumbnail = false,
  loading:dataLoading = false
}) => {
  const { classes } = useStyles()

  const [file, setFile] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(true);

  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [ref, { width: wrapperWidth, height: wrapperHeight }] = useElementSize();

  const fileCB = useCallback(async () => {
    let file = {
      mimeType,
      name: downloadName,
    }

    if (data) {
      const magicNumberSlice = data.slice(0, 16)
      const mimeType = getMimeType(magicNumberSlice)

      // const blob = await (await fetch(`data:${mimeType};base64,${data}`))?.blob()

      file = { ...file, mimeType, data: `data:${mimeType};base64,${data}` }
    } else if (url) {
      const hrefparse = document.createElement('a')
      hrefparse.href = url
      const contentType = mime.lookup(hrefparse.pathname);
      file = { ...file, mimeType: contentType, url }
    }
    setFile(file)
  }, [data, downloadName, mimeType, url]);

  useEffect(() => {
    fileCB()
  }, [data, url]
  )

  const [pdfPages, setPdfPages] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [reset, setReset] = useState(0);


  const [error, setError] = useState(null);
  const [visiblePages, setVisiblePages] = useState({});
  const setPageVisibility = useCallback((pageNumber, isIntersecting) => {
    setVisiblePages((prevVisiblePages) => ({
      ...prevVisiblePages,
      [pageNumber]: isIntersecting
    }));
  }, []);

  const loading = useMemo(
    () => {
      return pdfLoading && dataLoading
      
    }, [pdfLoading, dataLoading]
  );

  if (!file?.data) {
    return <Alert severity="warning">waiting for file...</Alert>
  }

  if (loading) {
    return (
      <LinearProgress />
    )
  }
  if (error) {
    return (
      <Alert severity='error'>
        {error}
      </Alert>
    )
  }

  return (
    <div className={clsx(classes.root, asThumbnail&&classes.documentThumbnail)}>
      {!asThumbnail && (
        <DocumentToolbar
          onDownload={() => {
            const uri = file?.url || file?.data
            return saveFile(uri, file?.downloadName)
          }}
          pageObject={visiblePages}
          pageCount={pdfPages}
          isPageCountVisible={file?.mimeType === 'application/pdf'}
        />
      )}
      <div ref={ref} className={classes.rootContainer}>
        {!asThumbnail && (
          <DocumentOverlayControl
            onChangeScale={(value) => setScaleFactor(value)}
            onReset={()=>setReset(Math.random())}
            scale={scaleFactor}
          />
        )}
        {file?.mimeType === 'application/pdf' ? (
          <Document
            renderMode='canvas'
            renderAnnotationLayer={false}
            renderTextLayer={false}
            file={file?.data}
            className={asThumbnail ? classes.documentThumbnail : classes.documentContainer}
            onLoadError={(e) => {
              console.log('onLoadError', e)
              setError(e?.message)
              setPdfLoading(false)
            }}
            onLoadProgress={(e) => {
              console.log('onLoadProgress', e)
            }}
            onLoadSuccess={(e) => {
              if (asThumbnail) {
                setPdfPages(1)
              } else {
                setPdfPages(e?.numPages ?? 0)
              }
              setPdfLoading(false)
            }}
            onSourceError={(e) => {
              console.log('onSourceError', e)
              setError(e?.message)
              setPdfLoading(false)
            }}
            onSourceSuccess={(e) => {
              console.log('onSourceSuccess', e)
              setPdfLoading(true)

            }}
          >
            {Array.from(new Array(pdfPages), (el, index) => {
              if (asThumbnail) {
                return <Page
                  key={`page_${index + 1}`} pageNumber={index + 1}
                  height={80}
                  scale={1}
                />
              } else {
                return <PageWithObserver
                  key={`page_${index + 1}`} pageNumber={index + 1}
                  width={wrapperWidth}
                  setPageVisibility={setPageVisibility}
                  scale={scaleFactor}
                  onLoadSuccess={page => {
                    setPageHeight(page?.width)
                    setPageWidth(page?.height)
                  }}
                />
              }
            }
            )}

          </Document>
        ) : (
          <ImageLoader 
            asThumbnail={asThumbnail}
            file={file}
            scale={scaleFactor}
            onReset={reset}
          />
        )}


      </div>
    </div>
  )
}

const PageWithObserver = ({ pageNumber, setPageVisibility, ...otherProps }) => {
  const [page, setPage] = useState();

  const onIntersectionChange = useCallback(
    ([entry]) => {
      setPageVisibility(pageNumber, entry.isIntersecting);
    },
    [pageNumber, setPageVisibility]
  );

  const pageConfig = {
    threshold: [.5]
  }

  useIntersectionObserver(page, pageConfig, onIntersectionChange);

  return (
    <div ref={setPage}>
      <Page pageNumber={pageNumber} {...otherProps} />
    </div>
  );
}
export { DocumentViewer };
