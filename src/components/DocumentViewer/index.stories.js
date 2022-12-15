import { Grid, Typography } from "@mui/material";
import React from "react";
import { DocumentViewer } from ".";
import { pdfBase64Data, pngBase64Data } from "./data";

const DocumentViewerStory = {
  component: DocumentViewer,
  title: "DocumentViewer",

};

export default DocumentViewerStory;

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

const PDFURLStory = ({ ...args }) => (
  <div>
    <h3>Demo requires CORS anywhere access</h3>
    <a target="_blank" href="https://cors-anywhere.herokuapp.com/corsdemo">
      Request demo access first, then reload demo
    </a>
    <br />
    <DocumentViewer {...args} />
  </div>
);

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
  url:
    "https://cors-anywhere.herokuapp.com/http://africau.edu/images/default/sample.pdf",
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