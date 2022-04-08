import { Grid, Typography } from "@material-ui/core";
import React, { useCallback } from "react";
import { DocumentGallery } from ".";
import { pdfBase64Data, pngBase64Data } from "../DocumentViewer/data";
import axios from "axios";

const DocumentGalleryStory = {
  component: DocumentGallery,
  title: "DocumentGallery",
};

export default DocumentGalleryStory;

const DefaultStory = ({ ...args }) => (
  <Grid container>
    <Grid item xs={6}>
      placeholder
    </Grid>
    <Grid item xs={6}>
      <DocumentGallery {...args} />
    </Grid>
  </Grid>
);

export const Default = DefaultStory.bind({});
Default.args = {
  docs: [],
};

export const Base64 = DefaultStory.bind({});
Base64.args = {
  docs: [
    {
      mimeType: "image/png",
      data: pngBase64Data,
      name: "pngBase64Data",
    },
    {
      mimeType: "application/pdf",
      data: pdfBase64Data,
      name: "pdfBase64Data",
    },
  ],
};

const fetchData = async (pdfName) => {
  const result = (await axios.get(`http://localhost:7001/pdfs/${pdfName}.pdf`, { responseType: "arraybuffer" }))?.data;
  return Buffer.from(result, 'binary').toString('base64')
};

const RemoteStory = ({ ...args }) => {
  return (
    <Grid container>
      <Grid item xs={6}>
        placeholder
      </Grid>
      <Grid item xs={6}>
        <DocumentGallery {...args} />
      </Grid>
    </Grid>
  );
};
export const Remote = RemoteStory.bind({});
Remote.args = {
  docs: [
    {
      mimeType: "application/pdf",
      dataCallback: async()=> {
        return await fetchData("scientific")
      },
      name: "dl-scientific",
      displayName: "scientific",
    },
    {
      mimeType: "application/pdf",
      data: pdfBase64Data,
      name: "dl-pdfBase64Data",
      displayName: "pdfBase64Data",
    },
    {
      mimeType: "application/pdf",
      dataCallback: async ()=> {
        return await fetchData("hello")
      },
      name: "dl-hello",

    },
    {
      mimeType: "application/pdf",
      dataCallback: async ()=> {
        return await fetchData("form")
      },
      name: "dl-form",
      displayName: "form",
    },
    {
      mimeType: "application/pdf",
      dataCallback: async ()=> {
        return await fetchData("annotations")
      },
      name: "dl-annotations",
      displayName: "annotations",
    },
  ],
};

export const RemoteInitialIndex = RemoteStory.bind({});
RemoteInitialIndex.args = {
  ...Remote.args,
  initialIndex: 2,
}
