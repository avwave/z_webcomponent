import { Grid, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DocumentViewer } from ".";
import { pdfBase64Data, pngBase64Data } from "./data";
import { base64ArrayBuffer } from "../DocumentGallery/b64util";
import axios from "axios";

const DocumentViewerStory = {
  component: DocumentViewer,
  title: "DocumentViewer",

};

export default DocumentViewerStory;

const fetchData = async (pdfName) => {
  const result = (await axios.get(`http://localhost:7001/pdfs/${pdfName}.pdf`, { responseType: "arraybuffer" }))?.data;
  return base64ArrayBuffer(result)
};

const DefaultStory = ({ ...args }) => (
  <Grid container>
    <Grid item xs={6}>
      placeholder
    </Grid>
    <Grid item xs={6}>
      <DocumentViewer {...args} />
    </Grid>
  </Grid>
);

const ThumbnailStory = ({ ...args }) => (
  <DocumentViewer {...args} />
)

const PDFURLStory = ({ ...args }) => {
  const [data, setData] = useState(null);
  const d = useCallback(
    async () => {
      setData(await fetchData("scientific"))
    }, []
  );
  useEffect(
    () => {
      d()
    }, [d]
  );
  return (
    <Grid container>
      <Grid item xs={6}>
        placeholder
      </Grid>
      <Grid item xs={6}>
        <DocumentViewer {...args} data={data} />
      </Grid>
    </Grid>
  )
};

export const Default = DefaultStory.bind({});
Default.args = {};

export const Base64 = DefaultStory.bind({});
Base64.args = {
  data: pngBase64Data,
  mimeType: "image/png",
};

export const PDFBase64 = DefaultStory.bind({});
PDFBase64.args = {
  data: pdfBase64Data,
  mimeType: "application/pdf",
};

export const PDFURL = PDFURLStory.bind({});
PDFURL.args = {
  mimeType: "application/pdf",
};


export const ThumbnailBase64 = ThumbnailStory.bind({});
ThumbnailBase64.args = {
  data: pngBase64Data,
  mimeType: "image/png",
  asThumbnail: true,
};

export const ThumbnailPDFBase64 = ThumbnailStory.bind({});
ThumbnailPDFBase64.args = {
  data: pdfBase64Data,
  mimeType: "application/pdf",
  asThumbnail: true,
};

export const ThumbnailPDFURL = PDFURLStory.bind({});
ThumbnailPDFURL.args = {
  url:
    "https://cors-anywhere.herokuapp.com/http://africau.edu/images/default/sample.pdf",
  mimeType: "application/pdf",
  asThumbnail: true,
};