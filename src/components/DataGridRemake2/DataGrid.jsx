import React, {useState, useEffect, useRef, useCallback, useMemo, useContext} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort , faSortUp, faSortDown, faPlus, faBars, faFilter, faThumbtack,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import SearchIcon from '@mui/icons-material/Search';
import { render } from 'react-dom';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import {GridContext, actions} from "./GridContext";
import {Autocomplete, Button, Checkbox, Chip, Divider, FormControl, Grid, IconButton, InputLabel, InputAdornment, ListItemText , MenuItem, MenuList, OutlinedInput, Popover, Select, TextField, Typography, useTheme} from '@mui/material'
import { makeStyles } from 'tss-react/mui';
import { debounce } from 'lodash';
import './GridStyles.scss'

function DataGrid({columns, rows, hasSearch}) {
    const [state,dispatch] = useContext(GridContext)
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
// Sort
    const [headerCustomSortDirection, setHeaderCustomSortDirection] = useState(null)
    const [headerCustomSortColumn, setHeaderCustomSortColumn] = useState(null)
// Filters
    const [anchorElFilter, setAnchorElFilter] = useState(null)
    const [selectedFilter, setSelectedFilter] = useState('')
    const [headerCustomFilters, setHeaderCustomFilters] = useState([])
    const [selectedFilterOption, setSelectedFilterOption] = useState('')
    const [selectedFilterOptionMultiple, setSelectedFilterOptionMultiple] = useState([])
    const [selectedNestedFilter, setSelectedNestedFilter] = useState('')
// Search
    const [searchValue, setSearchValue] = useState('')
// useRefs
    const tableRef = useRef(null)
    const columnApi = useRef(null)
// Data
    const [rowData,setRowData] = useState([]);
    const [columnDefs,setColumnDefs] = useState([])

    const constructFilter = (element) => {
        // Sort input type = autocomplete, default, checkbox, nested, ...
        console.log("Filter: ",element)
        let filterObject = {
            label:element.field.charAt(0).toUpperCase() + element.field.slice(1), 
            isActive:false,
            type:'default',
            selectedOption:null,
            selectedNestedOption:null
        }
        if(element.filter.label){
            filterObject={
                ...filterObject,
                label:element.filter.label
            }
        }
        if(element.filter.type){
            filterObject = {
                ...filterObject,
                type: element.filter.type
            }
        }
        if(element.filter.options){
            filterObject={
                ...filterObject,
                options: element.filter.options
            }
        }
        console.log(filterObject)
        return filterObject
    }
// Mounting


    
// Update Handlers
    const updateSortColumn = (colId) => {
        // setHeaderCustomSortColumn(colId)
        dispatch({
            type: actions.SORT_COLUMN,
            payload:{
                sortColumn: colId
            }
        })
    }
    
    const updateSortDirection = (sortDir) => {
        // setHeaderCustomSortDirection(sortDir)
        dispatch({
            type: actions.SORT_DIRECTION,
            payload:{
                sortDirection: sortDir
            }
        })
    }
    
        const appendCustomFilter = (filter) => {
            // insert custom filter here
            dispatch({
                type: actions.FILTER_COLUMN,
                payload: [...state.filterColumns, filter]
            })
        }

        const removeCustomFilter = (filter) => {
            // Remove custom filter here
            let newCustomFilters = []
            state?.filterColumns?.map((curr)=> {
                if(curr === filter){
                    // insert ignore here
                }else{
                    // add to newCustomFilters
                }
            })
        }


    // Header Events:
    const SortColumn = async (col) => {
        // await ResetSort(col)
        let newColDef = col
        if(state?.sortColumn === col.column.colId){
            if(state?.sortDirection === 'asc'){
                return col.updateSortDirection('desc')
            }else if(state?.sortDirection === 'desc'){
                col.updateSortDirection(null)
                return col.updateSortColumn(null)
            }else{
                // set ascending sort logic here
                return col.updateSortDirection(('asc'))
            }
        }else{
            col.updateSortDirection('asc')

            return col.updateSortColumn(col.column.colId)
        }
    }
    // useEffect Trackers / Memoization
    // Debugging
    useEffect(() => {
        console.log("Sort: ", headerCustomSortColumn , headerCustomSortDirection)
    }, [headerCustomSortColumn,headerCustomSortDirection])

    useEffect(() => {
        console.log("gridContext: ",state) 
        // dispatch({
        //     type: actions.TEST_DISPATCH
        // })   
    }, [state])

    
    // Render:
    const CustomizedHeader = (col) => {
        const [anchorEl, setAnchorEl] = useState(null)
        const [isHovered, setIsHovered] = useState(false)
        const [currentSort, setCurrentSort] = useState(false)
        useEffect(() => {
            if(state?.sortColumn === col.column.colId){
                setCurrentSort(true)
            }
        }, [ state?.sortColumn])

        const handleMouseEnter = () => {
            setIsHovered(true);
        }
        
        const handleMouseLeave = () => {
            setIsHovered(false);
        }
        
        const handleDivClick = async () => {
            if(col.enableSorting){
                await SortColumn(col)
            }
        }
        const handlePopoverClick = (event) => {
            setAnchorEl(event.currentTarget);
        }

        const handlePopoverClose = () => {
            setAnchorEl(null);
        }
        // Pinning
        const handlePinRight = () => {
            col.columnApi.setColumnPinned(col.column.colId,'right')
            handlePopoverClose()
        }
        const handlePinLeft = () => {
            col.columnApi.setColumnPinned(col.column.colId,'left')
            handlePopoverClose()
        }
        const handleUnpin = () => {
            col.columnApi.setColumnPinned(col.column.colId, false)
            handlePopoverClose()
        }
        const handleHide = () => {
            col.columnApi.setColumnVisible(col.column.colId,false)
        }
        const sampleClick =() => {
            handlePopoverClose()
        }
        return (
            <div style={{display: 'flex',width:'100%',alignItems:'center'}}>
                <IconButton sx={{fontSize:'15px'}}
                    onClick = {handlePopoverClick}
                >
                    <FontAwesomeIcon icon={faBars} style={{paddingRight:'0.1rem'}}/>
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
                        { (col.column.pinned === null || col.column.pinned === 'left')  && (
                            <div style={{padding:'0.2rem 0 0.2rem 0'}}>
                                <Button onClick={handlePinRight} size="small" fullWidth style={{padding: '0.5rem 6rem 0.5rem 1rem',textTransform: "none", justifyContent:'flex-start',color:'black'}} >
                                    <FontAwesomeIcon icon={faThumbtack} style={{color: 'black',transform: 'rotate(270deg)', fontSize: '15px' }}/> <Typography sx={{fontSize: '13px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 400, paddingLeft:'1.5rem'}}>Pin Right</Typography>
                                </Button >
                            </div>)
                        }
                        { (col.column.pinned === null || col.column.pinned === 'right') && (
                            <div style={{padding:'0.2rem 0 0.2rem 0'}}>
                                <Button onClick={handlePinLeft} fullWidth size="small" sx={{padding: '0.5rem 2.5rem 0.5rem 1rem',textTransform: "none", justifyContent:'flex-start',paddingTop:'0.5rem',color:'black'}} >
                                    <FontAwesomeIcon icon={faThumbtack} style={{color: 'black',transform: 'rotate(90deg)', fontSize: '15px' }}/><Typography sx={{fontSize: '13px',fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 400, paddingLeft:'1.5rem'}}>Pin Left</Typography>
                                </Button>
                            </div>)
                        }
                        { (col.column.pinned === 'right' || col.column.pinned === 'left') && (
                            <div style={{padding:'0.2rem 0 0.2rem 0'}}>
                                <Button onClick={handleUnpin} fullWidth size="small" sx={{padding: '0.5rem 2.5rem 0.5rem 1rem',textTransform: "none", justifyContent:'flex-start',paddingTop:'0.5rem',color:'black'}} >
                                    <FontAwesomeIcon icon={faThumbtack} style={{color: 'black', fontSize: '15px' }}/><Typography sx={{fontSize: '13px',fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 400, paddingLeft:'1.5rem'}}>Unpin</Typography>
                                </Button>
                            </div>)
                        }
                        <Divider/>
                            <div style={{padding:'0.5rem 0 0.2rem 0'}}>
                                <Button onClick={handleHide} fullWidth size="small" style={{padding: '0.5rem 2.5rem 0.5rem 1rem',textTransform: "none", justifyContent:'flex-start',paddingTop:'0.5rem',color:'black'}} >
                                    <FontAwesomeIcon icon={faEyeSlash} style={{color: 'black',fontSize: '12px'}} /><Typography sx={{fontSize: '13px',fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 400, paddingLeft:'1.3rem'}}>Hide Column</Typography>
                                </Button>
                            </div>
                    </Grid>
                </Popover>
                <div 
                    style={{ display: 'flex', alignItems: 'center',flex:1}}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleDivClick}
                >
                {col.displayName} 
                { col.enableSorting && (isHovered || currentSort) && (
                        (!currentSort || col.sortDirection === null )?
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
                </div>
            </div>
        )
    }
    useEffect(() => {
        console.log("Columns: ", columns)
        if(columns){
            dispatch({
                type: actions.LOAD_COLUMNS,
                payload:{
                    columns: columns
                }
            })
            if(columns.length >= 0){
                let newColumns = []
                let updatedArray = []
                columns.forEach((element,i) => {
                    console.log("Checking out this column: ",element)
                    const newElement = {
                        ...element
                    }
                    newColumns[i] = newElement
                    // Filters
                    if(element.filter){
                        let filterObject = constructFilter(element)
                        // default value
                        updatedArray = [...updatedArray,filterObject]
                    }
                    
                });
                console.log("updatedArray: ",updatedArray)
                dispatch({
                    type: actions.FILTER_COLUMN,
                    payload: {
                        filterColumns: updatedArray
                    }
                })
                dispatch({
                    type: actions.LOAD_COLUMNS,
                    payload:{
                        columns: columns
                    }
                })
                dispatch({
                    type: actions.SET_LOADING_DONE
                })
                // setColumnDefs(newColumns)
            }
        }
    }, [columns]);

// Context listeners
    useEffect(() => {
        if(state.columns)
            setColumnDefs(state.columns)
    }, [state.columns])

    useEffect(() => {
        if(rows){
            if(rows.length >= 0){
                // setRowData(rows)
                dispatch({
                    type:actions.LOAD_ROWS,
                    payload:{
                        rows: rows
                    }
                })
            }
        }
    }, [rows])

    // Grid 
    const defaultColDef = {
        resizable: true,
        flex: 1,
        headerComponent: CustomizedHeader,
        headerComponentParams: {
            headerCustomSortDirection: headerCustomSortDirection,
            updateSortDirection: updateSortDirection,
            headerCustomSortColumn: headerCustomSortColumn,
            updateSortColumn: updateSortColumn,
        }
    }
    const onGridReady = (params) => {
        columnApi.current = params.columnApi
    }
//  
    const handlePopoverFilterClick = (e) => {
        setAnchorElFilter(e.currentTarget)
    }
    const handlePopoverFilterClose = () => {
        setSelectedFilter('')
        setSelectedFilterOption('')
        setSelectedNestedFilter('')
        setSelectedFilterOptionMultiple([])
        setAnchorElFilter(null)
    }
    const sampleClick = () => {
        console.log('click')
    }

    const handleSearchChange =(e) => {
        setSearchValue(e.target.value)
        // Insert Search
        debounce(()=>{
            dispatch({
                type: actions.SET_SEARCH,
                payload: {
                    ...state,
                    search: e.target.value
                }
            })
        },500)()
        
    }
    const handleSearchSubmit = (e) => {
        dispatch({
            type: actions.SET_SEARCH,
            payload: {
                ...state,
                search: searchValue
            }
        })
    }
    
// FILTERS
    const handleSelectedFilter = (e) => {
        setSelectedFilterOption('')
        setSelectedNestedFilter('')
        setSelectedFilterOptionMultiple([])
        setSelectedFilter(e.target.value)
    }
    const handleSelectedFilterOption = (e) => {
        setSelectedFilterOption(e.target.value)
    }
    const handleSelectedFilterAutocomplete = (e,v) => {
        if(v){
            setSelectedFilterOption(v.value)
        }else{
            setSelectedFilterOption('')
        }
    }

    const handleSelectedFilterOptionMultiple = (e) => {
        console.log("mult options")
        console.log(e.target.value)
        const currArray = e.target.value
        let newArray = []
        currArray.forEach(element => {
            newArray = [...newArray,element.value]
        });
        
        setSelectedFilterOptionMultiple(e.target.value)
        setSelectedFilterOption(newArray)
    }

    const handleSelectedNestedFilter = (e) => {
        console.log("Selected Nested Filter: ",e.target.value)
        if(e.target.value.nestedOptions){
            setSelectedNestedFilter(e.target.value)
        }else{
            setSelectedNestedFilter(e.target.value)
            setSelectedFilterOption(e.target.vlue)
        }
    }


    const handleApplyFilter = (e) =>{
        // Find the target filter in the headerCustomFilters array
        let targetFilter = state?.filterColumns.find(obj => obj.label === selectedFilter.label);
        const targetFilterIndex = state?.filterColumns.findIndex(obj => obj.label === selectedFilter.label);
        let updatedFilterColumns = [...state.filterColumns];
        console.log("Target Filter: ", targetFilter, targetFilterIndex, e);
        // consider nested property
        if (targetFilterIndex !== -1){
            console.log("isActive")
            // Update the target filter's isActive property
            if (targetFilter) {
                updatedFilterColumns[targetFilterIndex] = {
                    ...updatedFilterColumns[targetFilterIndex],
                    isActive: true,
                    selectedOption: selectedFilterOption,
                };
                if(targetFilter.type==='nestedAutocomplete'){
                    updatedFilterColumns[targetFilterIndex] = {
                        ...updatedFilterColumns[targetFilterIndex],
                        selectedNestedOption: selectedNestedFilter
                    };
                }
                // Create a new array with the updated filter
                // Update the state with the updated filters
                // setHeaderCustomFilters(updatedFilters);
                dispatch({
                    type:actions.FILTER_COLUMN,
                    payload:{
                        filterColumns:updatedFilterColumns
                    }
                })
            }
        }
        console.log("Close")
        handlePopoverFilterClose()
    }

    const handleChipDelete = (deletedElement) => {
        const updatedFilters = state?.filterColumns.map(element => {
            if (element === deletedElement) {
                console.log("Element: ",element," deleted Element: ",deletedElement)
                return { ...element, 
                        isActive: false,
                        selectedOption: null,
                        selectedNestedOption: null
                    };
            }
            return element;
            });
        
            // setHeaderCustomFilters(updatedFilters);
            dispatch({
                type:actions.FILTER_COLUMN,
                payload:{
                    filterColumns:updatedFilters
                }
            })
            console.log(state?.filterColumns);
    }


    return (
            <Grid container direction='column' justifyContent='center' style={{ minHeight: '90vh', minWidth: '90vw'}} className="grid-wrapper">
                <Grid item xs style={{flex:0, minHeight:'3.5rem', marginBottom: hasSearch ? '0px': '-1.47rem', }}>
                    <Grid container sx={{px:'1rem', py:'0.5rem'}}>
                        <Grid item xs={8} sm={9} style={{paddingTop:'0.5rem', display:'flex'}}>
                        {/* If filter: */}
                        { state?.filterColumns.length > 0 && (
                            <Grid container alignItems="center" direction='row'>
                                <div style={{display:'flex', 
                                justifyContent:'center', alignItems:'center' ,overflowX: 'auto',minHeight:'2rem'
                                }}>
                                <FontAwesomeIcon 
                                    icon={faFilter} 
                                    style={{
                                        color:'#4D4C53',
                                        fontSize:'12px',
                                        marginTop:'0px'
                                    }}
                                />
                                <Typography 
                                    variant="subtitle2"
                                    style={{ 
                                        padding: '0 0.3rem 0 0.3rem',
                                        fontWeight:'400',
                                        fontSize:'16px'
                                    }}
                                >
                                    Filters: 
                                </Typography>
                                
                                { //Display chips here
                                    state?.filterColumns.filter(obj => obj.isActive === true).map(element => (
                                        <Chip label={element.label} size="small" onDelete={()=>handleChipDelete(element)} style={{marginLeft:'0.5rem',paddingTop:'2px',padding:'0 8px 0px 9px'}} />
                                        ))
                                }
                                
                                </div >
                                { //only display add filter button if headerCustomFilter.length < activeFilters.length
                                    (state?.filterColumns.filter(obj => obj.isActive === false).length > 0 )&& (
                                    <>
                                    <IconButton 
                                        onClick={handlePopoverFilterClick}
                                        // color='secondary' 
                                        sx={{
                                            backgroundColor:'#eceef1',
                                            // color:'#4D4C53',
                                            marginTop:'0.2rem',
                                            marginLeft:'0.6rem', 
                                            height:'20px',
                                            width:'20px',
                                            borderRadius:'8px',
                                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
                                            
                                        }}
                                >
                                    <FontAwesomeIcon icon={faPlus} style={{width:'0.7rem'}}/>
                                </IconButton>
                                <Popover
                                    open={Boolean(anchorElFilter)}
                                    anchorEl={anchorElFilter}
                                    onClose={handlePopoverFilterClose}
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
                                            borderRadius:'12px',
                                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
                                            marginTop:'0.5rem'
                                        }
                                    }}
                                >
                                    <div style={{padding:'0.8rem 0 1rem 0',minWidth:'20rem'}}>
                                        <div size="small" style={{padding: '0.5rem 1rem 0.5rem 1rem', paddingLeft:'1.5rem', textTransform: "none", justifyContent:'flex-start',color:'black'}} >
                                            <Typography sx={{paddingBottom: '0.3rem',fontSize: '19px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 300}}>
                                                {/* Filters: */}
                                            </Typography>
                                                <FormControl variant="outlined" fullWidth >
                                                    <Select
                                                        labelId="filter-select"
                                                        id="filter-select"
                                                        style={{height:'30px'}}
                                                        value={selectedFilter}
                                                        onChange={handleSelectedFilter}
                                                    >
                                                        <MenuItem value={''} disabled >
                                                            <em>Filter</em>
                                                        </MenuItem>
                                                        { //loop for every active filter
                                                            state?.filterColumns.filter(obj => obj.isActive === false).map(element => (
                                                                <MenuItem value={element} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                    {element.label}
                                                                </MenuItem>
                                                        )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                                { selectedFilter === '' ? //insert here filter type
                                                    <></>
                                                :
                                                selectedFilter.type === 'default' ?                                             
                                                    <MenuList dense value={selectedFilterOption} onMouseUp={handleSelectedFilterOption} style={{paddingTop:'1rem'}}>
                                                        { //loop for every active filter
                                                            selectedFilter?.options &&(
                                                                selectedFilter.options.map(element => (
                                                                    <MenuItem value={element.value} selected={selectedFilterOption === element.value}>
                                                                        <Typography >{element.label}</Typography>
                                                                    </MenuItem>
                                                                ))
                                                            )
                                                        }
                                                    </MenuList>
                                                :
                                                selectedFilter.type === 'autocomplete' ?
                                                <Autocomplete
                                                    id="autocomplete-filter"
                                                    options={selectedFilter.options}
                                                    style={{paddingTop:'0.5rem'}}
                                                    onChange={handleSelectedFilterAutocomplete || ''}
                                                    renderInput={(params)=><TextField {...params} size='small'  />}
                                                />
                                                :
                                                selectedFilter.type === 'multiple' ?
                                                <FormControl  fullWidth style={{paddingTop:'0.5rem'}}>
                                                    <Select
                                                        labelId="multiple-filter"
                                                        id="multiple-filter"
                                                        multiple
                                                        style={{height:'30px'}}
                                                        value={selectedFilterOptionMultiple}
                                                        onChange={handleSelectedFilterOptionMultiple}
                                                        renderValue ={(selected) => {
                                                                if(selected){
                                                                    let displayStr= selected.map(obj => obj.label)
                                                                    const joinedStr = displayStr.join(', ')
                                                                    return joinedStr
                                                                }
                                                                return ''
                                                            }
                                                        }
                                                    >
                                                        <MenuItem value={''} disabled >
                                                            <em>Filter</em>
                                                        </MenuItem>
                                                        { //loop for every active filter
                                                            selectedFilter.options.map(element => (
                                                                <MenuItem value={element} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                    <Checkbox checked={selectedFilterOptionMultiple.some(obj => obj.value === element.value)}/>
                                                                    {element.label}
                                                                </MenuItem>
                                                        )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                                :
                                                <>
                                                <FormControl  fullWidth style={{paddingTop:'0.5rem'}}>
                                                    <Select
                                                        labelId="nested-filter" //nested filter options availabe else nest
                                                        id="nested-filter"
                                                        style={{height:'30px'}}
                                                        value={selectedNestedFilter}
                                                        onChange={handleSelectedNestedFilter}
                                                    >
                                                        <MenuItem value={''} disabled >
                                                            <em>Filter</em>
                                                        </MenuItem>
                                                        { //loop for every active filter
                                                            selectedFilter.options.map(element => (
                                                                <MenuItem value={element} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                    {element.label}
                                                                </MenuItem>
                                                        )
                                                        )}
                                                        
                                                    </Select>
                                                </FormControl>
                                                
                                                { selectedNestedFilter.nestedOptions && (
                                                        <>
                                                            <Autocomplete
                                                                id="autocomplete-filter"
                                                                options={selectedNestedFilter.nestedOptions} //find selected filter option == nest filter
                                                                style={{paddingTop:'0.5rem'}}
                                                                onChange={handleSelectedFilterAutocomplete || ''}
                                                                renderInput={(params)=><TextField {...params} size='small'  />}
                                                            />
                                                        </>
                                                    )   
                                                }
                                                </>
                                                }
                                                <Grid container spacing={1} justifyContent='flex-end' style={{marginTop:'0.5rem'}}>
                                                    <Grid item>
                                                        <Button variant='outlined' onClick={handlePopoverFilterClose} color='error' size='small' style={{textTransform:'none'}}>Cancel</Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button variant='outlined' onClick={handleApplyFilter} disabled={selectedFilterOption === ''} size='small' style={{textTransform:'none'}}>Apply</Button>
                                                    </Grid>
                                                </Grid>
                                        </div >
                                    </div>
                                </Popover>
                                </>)
                                }
                            </Grid>
                        )}
                        </Grid>
                        
                        {/* If has search */}
                        <Grid item xs={4} sm={3} >
                            {hasSearch && (
                                <Grid container  justifyContent='flex-end'>
                                    <FormControl 
                                        variant="outlined"
                                        size="small"
                                    >
                                        <InputLabel htmlFor="outlined-search">
                                            Search
                                        </InputLabel>
                                        <OutlinedInput
                                            id="outlined-search"
                                            type={'text'}
                                            onChange={handleSearchChange}
                                            value={searchValue}
                                            label="Search"
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                onClick={handleSearchSubmit}
                                                edge="end"
                                                >
                                                <SearchIcon/>
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>
                    </Grid> 
                </Grid>
                <Grid item xs={true} container justifyContent="center">
                    <div className="ag-theme-alpine" style={{height: '100%', width:'100%'}}>
                        <AgGridReact
                            ref={tableRef}
                            rowData={ state.rows}
                            columnDefs={ columnDefs}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReady}
                        >
                        </AgGridReact>
                    </div>
                </Grid>
            </Grid>
    )
}

export default DataGrid