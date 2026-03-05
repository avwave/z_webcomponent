import React, {useState, useEffect, useRef, useCallback, useMemo, useContext, memo} from 'react'
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import {GridContext, actions} from "./GridContext";
import CustomHeader from "./CustomHeader"
import { render } from 'react-dom';
import { debounce } from 'lodash';
import { makeStyles } from 'tss-react/mui';
import {Autocomplete, Box, Button, Checkbox, Chip, Divider, FormControl, Grid, IconButton, InputLabel, InputAdornment, ListItemText , MenuItem, MenuList, OutlinedInput, Popover, Select, TextField, Typography, useTheme} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort , faSortUp, faSortDown, faPlus, faBars, faFilter, faThumbtack,faEyeSlash } from '@fortawesome/free-solid-svg-icons';

//======================= MAIN =====================
function DataGrid(props) {
    const [state,dispatch] = useContext(GridContext)
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState(null) 
    const gridRef = useRef()
    
    
    const components = {
        agColumnHeader: CustomHeader
    }
    
    const defaultColDef = {
        resizable: true,
        flex:1
    }
    const columnTypes ={
        centerAligned: {
            cellStyle: {
                display: 'flex ',
                justifyContent: 'center',
                alignItems: 'center '
            }
        },
    }

    useEffect(() => {
        if(state.loading == true){
            // Start Loading
            gridRef?.current?.api?.showLoadingOverlay()
            
        }else{
            // Remove loading
            gridRef?.current?.api?.hideOverlay()
            
        }
    }, [state.loading])
    
    useEffect(() => {
        dispatch({
            type:actions.SORT_DIRECTION,
            payload:{
                sortDirection: sortDirection
            }
        })
    }, [sortDirection])
    
    
    useEffect(() => {
        dispatch({
            type:actions.SORT_COLUMN,
            payload:{
                sortColumn: sortColumn
            }
        })
    }, [sortColumn])
    
    

    useEffect(() => {
        dispatch({
            type: actions.LOAD_ROWS,
            payload:{
                rows: props?.gridProps?.rows ?? []
            }
        })
        dispatch({
            type: actions.LOAD_COLUMNS,
            payload:{
                columns: props?.gridProps?.columns ?? []
            }
        })

    }, [])
    
    return (
        <div className={props?.gridProps?.gridTheme ? props.gridProps?.gridTheme : 'ag-theme-alpine-dark' } style={{height:'100%'}}>
            <AgGridReact
                ref={gridRef}
                rowData={state.rows}
                columnDefs={state.columns}
                defaultColDef={defaultColDef}
                columnTypes={columnTypes}
                components={props?.headerType === 'serverSide' ? components : props?.components ? props?.components:null}
                // overlayLoadingTemplate={ 
                //     `<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>`
                    
                // }
                {...props.gridProps}
            />
        </div>
    )
}



export default DataGrid