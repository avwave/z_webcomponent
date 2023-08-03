import React, {useState, useEffect, useRef, useCallback, useMemo, useContext, memo} from 'react'
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import {GridContext, actions} from "./GridContext";
import { render } from 'react-dom';
import { debounce } from 'lodash';
import { makeStyles } from 'tss-react/mui';
import {Autocomplete, Box, Button, Checkbox, Chip, Divider, FormControl, Grid, IconButton, InputLabel, InputAdornment, ListItemText , MenuItem, MenuList, OutlinedInput, Popover, Select, TextField, Typography, useTheme} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort , faSortUp, faSortDown, faPlus, faBars, faFilter, faThumbtack, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const CustomHeader= memo((props)=>{
    const [state,dispatch] = useContext(GridContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const [isHovered, setIsHovered] = useState(false)
    const [currentSort, setCurrentSort] = useState(false)
    const [isColHidden, setIsColHidden] = useState(false)

    const handlePopoverClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handlePopoverClose = () => {
        setAnchorEl(null);
    }
    // Pinning
    const handlePinRight = () => {
        props.columnApi.setColumnPinned(props.column.colId,'right')
        handlePopoverClose()
    }
    const handlePinLeft = () => {
        props.columnApi.setColumnPinned(props.column.colId,'left')
        handlePopoverClose()
    }
    const handleUnpin = () => {
        props.columnApi.setColumnPinned(props.column.colId, false)
        handlePopoverClose()
    }
    const handleHide = () => {
        props.columnApi.setColumnVisible(props.column.colId,false)
    }
    const handleUnhide = () => {
        props.columnApi.getColumns().map((element)=>{
            props.columnApi.setColumnVisible(element.colId,true)
        })
    }

    function onSortClicked(event) {
        // alternative client side sort
        props.progressSort(event.shiftKey);
    };  

    const checkColHidden= ()=>{
        props.columnApi.getColumns().map((element)=>{
            if(!element.visible){
                return setIsColHidden(true)
            }
        })
        return setIsColHidden(false)
    }
        
    useEffect(() => {
        if(state?.sortDirection != null){
            if(state?.sortColumn && state?.sortColumn === props?.column?.colId){
                return setCurrentSort(true)
            }else{
                return setCurrentSort(false)
            }
        }else{
            return setCurrentSort(false)
        }
        
    }, [state?.sortColumn])
    
    const setHoveredTrue =()=>{
        setIsHovered(true)
    }
    const setHoveredFalse= ()=>{
        setIsHovered(false)
    }
    
    const handleSort=(props)=>{
        if( state?.sortColumn !== null  && props?.column?.colId == state?.sortColumn){
            if(state?.sortDirection === 'asc'){
                dispatch({
                    type: actions.SORT_DIRECTION,
                    payload:{
                        sortDirection: 'desc'
                    }
                })
                    
            }else if(state?.sortDirection === 'desc'){
        //         setSortDirection(null)
                dispatch({
                    type: actions.SORT_DIRECTION,
                    payload:{
                        sortDirection: null
                    }
                })
                dispatch({
                    type:actions.SORT_COLUMN,
                    payload:{
                        sortColumn: null
                    }
                })
            }else{
        //         setSortDirection('asc')
                dispatch({
                    type: actions.SORT_DIRECTION,
                    payload:{
                        sortDirection: 'asc'
                    }
                })
            }
        }else{//set to asc
            dispatch({
                type:actions.SORT_COLUMN,
                payload:{
                    sortColumn: props?.column?.colId
                }
            })
            dispatch({
                type: actions.SORT_DIRECTION,
                payload:{
                    sortDirection: 'asc'
                }
            })
        }
    }
    
    return (
        <div style={{display: 'flex', alignItems:'center', width:'100%'}} >
            <IconButton  onClick={handlePopoverClick} sx={{fontSize:'15px', color:'white'}} >
                <FontAwesomeIcon icon={faBars} style={{paddingRight:'0.1rem'}} />
            </IconButton>
            <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    PaperProps={{
                        style:{
                            
                        }
                    }}
                    
            >
                <Grid container direction='column'>
                    { (props.column.pinned === null || props.column.pinned === 'left')  && (
                        <div style={{padding:'0.8rem 0 0.2rem 0'}}>
                            <Button onClick={handlePinRight} size="small" fullWidth style={{padding: '0.5rem 2.5rem 0.5rem 1rem',textTransform: "none", justifyContent:'flex-start',color:'black'}} >
                                <FontAwesomeIcon icon={faThumbtack} style={{color: 'black',transform: 'rotate(270deg)', fontSize: '15px' }}/> <Typography sx={{fontSize: '12px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 400, paddingLeft:'1rem'}}>Pin Right</Typography>
                            </Button >
                        </div>)
                    }
                    { (props.column.pinned === null || props.column.pinned === 'right') && (
                        <div style={{padding:'0.2rem 0 0.2rem 0'}}>
                            <Button onClick={handlePinLeft} fullWidth size="small" sx={{padding: '0.5rem 2.5rem 0.5rem 1rem',textTransform: "none", justifyContent:'flex-start',paddingTop:'0.5rem',color:'black'}} >
                                <FontAwesomeIcon icon={faThumbtack} style={{color: 'black',transform: 'rotate(90deg)', fontSize: '15px' }}/><Typography sx={{fontSize: '12px',fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 400, paddingLeft:'1rem'}}>Pin Left</Typography>
                            </Button>
                        </div>)
                    }
                    { (props.column.pinned === 'right' || props.column.pinned === 'left') && (
                        <div style={{padding:'0.2rem 0 0.2rem 0'}}>
                            <Button onClick={handleUnpin} fullWidth size="small" sx={{padding: '0.5rem 2.5rem 0.5rem 1rem',textTransform: "none", justifyContent:'flex-start',paddingTop:'0.5rem',color:'black'}} >
                                <FontAwesomeIcon icon={faThumbtack} style={{color: 'black', fontSize: '15px' }}/><Typography sx={{fontSize: '12px',fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 400, paddingLeft:'1rem'}}>Unpin</Typography>
                            </Button>
                        </div>)
                    }
                    <Divider/>
                        
                            <div style={{padding:'0.5rem 0 0.2rem 0'}}>
                                <Button onClick={handleUnhide} fullWidth size="small" sx={{padding: '0.5rem 2.5rem 0.5rem 1rem',textTransform: "none", justifyContent:'flex-start',paddingTop:'0.5rem',color:'black'}} >
                                    <FontAwesomeIcon icon={faEye} style={{color: 'black', fontSize: '12px' }}/><Typography sx={{fontSize: '12px',fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 400, paddingLeft:'1rem'}}>Show All Columns</Typography>
                                </Button>
                            </div>
                    
                        
                        <div style={{padding:'0.2rem 0 0.8rem 0'}}>
                            <Button onClick={handleHide} fullWidth size="small" style={{padding: '0.5rem 2.5rem 0.5rem 1rem',textTransform: "none", justifyContent:'flex-start',paddingTop:'0.5rem',color:'black'}} >
                                <FontAwesomeIcon icon={faEyeSlash} style={{color: 'black',fontSize: '12px'}} /><Typography sx={{fontSize: '12px',fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 400, paddingLeft:'1rem'}}>Hide Column</Typography>
                            </Button>
                        </div>

                </Grid>
            </Popover>
            <span 
                style={{
                    display:'flex',
                    alignItems:'center',
                    width:'100%',
                    cursor: isHovered ? 'pointer': 'none'
                }}
                // onClick={(event)=>{ 
                    //this is a sample of a client-side sorting
                    //     onSortClicked(event)
                    // }}
                    
                onClick={(event)=> {if(props?.enableSorting) handleSort(props)}}
                onTouchStart ={(event)=>{if(props?.enableSorting) handleSort(props)}}
                onMouseEnter={setHoveredTrue}
                onMouseLeave={setHoveredFalse}
            >
            {props?.displayName}
            <span style={{ paddingLeft:'0.5rem'}}>
            { props?.enableSorting && (isHovered || currentSort) && (
                (!currentSort || state?.sortDirection === null )?
                <>
                    <FontAwesomeIcon icon={faSort} style={{marginLeft:"auto" }}/>
                </>
                    
                : state?.sortDirection === 'desc' ?
                <>
                    <FontAwesomeIcon icon={faSortDown} style={{marginLeft:"auto" }}/>
                </>
                : 
                <>
                    <FontAwesomeIcon icon={faSortUp} style={{marginLeft:"auto" }}/>
                </>
            )}
            </span>
            </span>
        </div>
    )
})

export default CustomHeader