import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState } from 'react';
import { AppBar, Box, Button, ButtonGroup, IconButton, Toolbar, Typography } from '@mui/material';
import { AddBox, Download, IndeterminateCheckBox, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';


const useStyles = makeStyles()(theme => ({
  overlay:{
    position: 'absolute',
    bottom: theme.spacing(2),
    right:0,
    zIndex: 999,
    display:'flex',
    flexDirection:'column'
  }
}));
const DocumentToolbar = ({
  onDownload=()=>{},
  onSetPageUp=()=>{},
  onSetPageDown=()=>{},
  pageCount,
  pageObject,
  isPageCountVisible=true
}) => {

  const currentPage = useMemo(
    () => {
      const visiblePages =  Object.entries(pageObject).filter(([key, value]) => value).map(([key, value]) => key)
      return visiblePages?.[visiblePages.length - 1]
    }, [pageObject]
  );
  const { classes } = useStyles()
  return (
    <AppBar position='static' color='primary'>
      <Toolbar variant="dense">
        {isPageCountVisible && (
        <Typography variant="body1" color="inherit">{currentPage}/{pageCount}</Typography>
        )}
        <Box flexGrow={1}/>
        <IconButton onClick={()=>onDownload()}>
          <Download/>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}


const DocumentOverlayControl = ({
  onChangeScale=(scale)=>{},
  onZoomIn=()=>{},
  onZoomOut=()=>{},
  scale=1,
  onReset = () => { }
}) => {
  const { classes } = useStyles()
  return (
    <div className={classes.overlay}>
      <Button size="large" color="info" onClick={()=> {
        onChangeScale(scale + .5)
        onZoomIn()
      }}>
        <AddBox/>
      </Button>
      <Button size="large" color="info" onClick={()=>{
        onChangeScale(scale - .5)
        onZoomOut()
      }}>
        <IndeterminateCheckBox/>
      </Button>
      <Button size="large" color="info" onClick={()=>{
        onChangeScale(1)
        onReset()
      }}>
        <FontAwesomeIcon icon={faExpand}/>
      </Button>
    </div>
  )
}
export { DocumentToolbar, DocumentOverlayControl }