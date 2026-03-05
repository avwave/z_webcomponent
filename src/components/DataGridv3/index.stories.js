import React, { useState, useEffect, useContext, useReducer, useMemo} from 'react'
import DataGrid from './DataGrid'
import { GridContext, actions, initialState, gridReducer , DataGridProvider} from './GridContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort , faSortUp, faSortDown, faPlus, faBars, faFilter, faThumbtack,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {Button, Chip, IconButton, Paper, Typography } from '@mui/material'
import GenerateMockData from './GenerateMockData'
import './GridStyles.scss'
const DataGridv3 = {
    title: "DataGrid v3",
    component: DataGrid
}

export default DataGridv3

export const DefaultStory = ({...args}) => {
    const [state,dispatch] = useReducer(gridReducer,initialState)
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState(null)
    return (
        <Paper sx={{height:'50vh'}} >
            <DataGridProvider>
                <DataGrid {...args}/>
            </DataGridProvider>
        </Paper>
    )
}

export const Default = DefaultStory.bind({});


Default.args = {
    gridProps:{
        rows:GenerateMockData(100),
        columns: [  
            { field: 'id', headerName:"ID", sortable:true , flex:0, width:80 },
            { field: 'title', sortable:true },
            { field:'location_scope', headerName:'Scope', sortable: true },
            { field: 'reviews',sortable:true},
            { field: 'comments',sortable:true},
            { field: 'filler',sortable:true},
            { field: 'enabled',sortable:true},
        ]
    }
}


export const LightTheme = DefaultStory.bind({})

LightTheme.args = {
    gridProps:{
        gridTheme: 'ag-theme-alpine',
        rows:GenerateMockData(15),
        columns: [  
            { field: 'id', headerName:"ID", sortable:true , flex:0, width:80 },
            { field: 'title', sortable:true },
            { field:'location_scope', headerName:'Scope', sortable: true },
            { field: 'reviews',sortable:true},
            { field: 'comments',sortable:true},
            { field: 'filler',sortable:true},
            { field: 'enabled',sortable:true},
        ]
    }
}

export const CustomColors = DefaultStory.bind({})

CustomColors.args = {
    gridProps:{
        gridTheme: 'ag-theme-alpine custom-colors',
        rows:GenerateMockData(15),
        columns: [  
            { field: 'id', headerName:"ID", sortable:true , flex:0, width:80 },
            { field: 'title', sortable:true },
            { field:'location_scope', headerName:'Scope', sortable: true },
            { field: 'reviews',sortable:true},
            { field: 'comments',sortable:true},
            { field: 'filler',sortable:true},
            { field: 'enabled',sortable:true},
        ]
    }
}

export const CellAlignment = DefaultStory.bind({})

CellAlignment.args={
    gridProps:{
        rows:GenerateMockData(15),
        columns: [  
            { field: 'id', headerName:"ID", sortable:true , flex:0, width:80 },
            { field: 'title', sortable:true },
            { field:'location_scope', headerName:'Scope', sortable: true },
            { field: 'reviews',sortable:true, type: 'rightAligned' },
            { field: 'comments',sortable:true},
            { field: 'filler',sortable:true,type: 'centerAligned'}, 
            { field: 'enabled',sortable:true, type: 'centerAligned'},
        ]
    }
}

export const CellRender = DefaultStory.bind({})

CellRender.args={
    gridProps:{
        rows:GenerateMockData(15),
        columns: [
            { field: 'id', headerName:"ID", sortable:true , flex:0, width:80 },
            { field: 'title', sortable:true },
            { field:'location_scope', headerName:'Scope', sortable: true },
            { field: 'reviews',sortable:true},
            { field: 'comments',sortable:true},
            { field: 'filler',sortable:true, cellRenderer: params => {
                return (
                    <div>
                        {params.value ? 
                            
                            <Chip label="True" color="success" />
                        :
                            <Chip label="False" color="error" />
                        }
                    </div>
                )
            }},
            { field: 'enabled',sortable:true, cellRenderer: params => {
                return (
                    <div>
                        {params.value ? 
                            <Typography>True</Typography>
                        :
                            <Typography>False</Typography>
                        }
                    </div>
                )
            }},
        ]
    }
}

const LoadingStory = ({...args}) => {
    const [state,dispatch] = useReducer(gridReducer,initialState)
    
    return (
        <Paper sx={{height:'50vh'}} >
            <DataGridProvider>
                <DGWrapper {...args}/>
            </DataGridProvider>
        </Paper>
    )
}

function DGWrapper({...args}){
    const [state,dispatch] = useContext(GridContext)
    
    return(
        <div style={{height:'100%', width:'100%'}}>
        <Button variant={state.loading ? "outlined":"standard"} style={{textTransform:'none'}} onClick={()=>{
            dispatch({
                type:actions.SET_LOADING
            })
        }}>
            Set Loading
        </Button>
        <Button variant={state.loading ? "standard":"outlined"} style={{textTransform:'none'}} onClick={()=>{
            dispatch({
                type:actions.SET_LOADING_DONE
            })
        }}>
            Set Done Loading
        </Button>
        <DataGrid {...args}/>
        </div>
    )
}

export const LoadingSample = LoadingStory.bind({})

LoadingSample.args = {
    gridProps:{
        rows:GenerateMockData(10),
        columns: [  
            { field: 'id', headerName:"ID", sortable:true , flex:0, width:80 },
            { field: 'title', sortable:true },
            { field:'location_scope', headerName:'Scope', sortable: true },
            { field: 'reviews',sortable:true},
            { field: 'comments',sortable:true},
            { field: 'filler',sortable:true},
            { field: 'enabled',sortable:true},
        ]
    }
}

export const TemplateHeader = DefaultStory.bind({})

TemplateHeader.args = {
    headerType:'serverSide',
    gridProps:{
        rows:GenerateMockData(10),
        columns: [  
            { field: 'id', headerName:"ID", sortable:true , width:80 },
            { field: 'title', sortable:true },
            { field:'location_scope', headerName:'Scope', sortable: true },
            { field: 'reviews',sortable:true},
            { field: 'comments',sortable:true},
            { field: 'filler',sortable:true},
            { field: 'enabled',sortable:true},
        ]
    }
}


const CustomHeaderStory = ({...args}) => {
    const [state,dispatch] = useReducer(gridReducer,initialState)
    
    return (
        <Paper sx={{height:'50vh'}} >
            <DataGridProvider>
                <DGWrapperCustomHeader {...args}/>
            </DataGridProvider>
        </Paper>
    )
}

function DGWrapperCustomHeader({...args}){
    const [state,dispatch] = useContext(GridContext)

    const CustomHeaderComponent=(props)=>{
        return (
            <div style={{display: 'flex', alignItems:'center'}} >
                <Typography  style={{color:'pink'}}>
                {props.displayName}
                </Typography>
            </div>)
    }
    
    const components = useMemo(()=>{
        return {
            agColumnHeader: CustomHeaderComponent
        }
    })
    return(
        <div style={{height:'100%', width:'100%'}}>
            <DataGrid components={components} {...args}/>
        </div>
    )
}


export const CustomHeader = CustomHeaderStory.bind({})


CustomHeader.args = {
    gridProps:{
        rows:GenerateMockData(10),
        columns: [  
            { field: 'id', headerName:"ID", sortable:true , flex:0, width:80 },
            { field: 'title', sortable:true },
            { field:'location_scope', headerName:'Scope', sortable: true },
            { field: 'reviews',sortable:true},
            { field: 'comments',sortable:true},
            { field: 'filler',sortable:true},
            { field: 'enabled',sortable:true},
        ]
    }
}

function emulateFetch(rows){
    setTimeout(() => {
        return rows.append(GenerateMockData(10))
    }, 2000);
}