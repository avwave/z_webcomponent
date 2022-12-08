import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState } from 'react';

import { Dropzone, FileItem } from "@dropzone-ui/react"

const useStyles = makeStyles()((theme) => {
  return {}
});
const DropUploader = ({ 
  onChange=()=>{},
  onUploadFinished=()=>{}
 }) => {
  const { classes } = useStyles()
  const [files, setFiles] = useState([]);

  
  useEffect(() => {
    onChange(files)
  }, [files, onChange]);

  

  return (
    <Dropzone
      onChange={updateFiles => setFiles(updateFiles)} value={files}
      onUploadFinished={responses => onUploadFinished(responses)}
      
      accept="image/*,application/pdf"
      footer={false}
      label="Click here or drop files to upload"
      
    >
      {
        files.map(file => {
          return (<FileItem {...file} preview />)
        })
      }
    </Dropzone>
  )
}

export { DropUploader }