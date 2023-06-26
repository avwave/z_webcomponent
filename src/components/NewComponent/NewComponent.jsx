import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort , faSortUp, faSortDown, faPlus, faBars, faFilter, faThumbtack,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import SearchIcon from '@mui/icons-material/Search';
import { render } from 'react-dom';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import {Button, Divider, FormControl, Grid, IconButton, InputLabel, InputAdornment, MenuItem, OutlinedInput, Popover, Select, TextField, Typography, useTheme} from '@mui/material'
import { makeStyles } from 'tss-react/mui';
import './GridStyles.scss'


function NewComponent({columns,rows,hasSearch}) {
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [isColumnsLoaded, setIsColumnsLoaded] = useState(false)
    const [headerCustomSortDirection, setHeaderCustomSortDirection] = useState(null)
    const [headerCustomSortColumn, setHeaderCustomSortColumn] = useState(null)
    const [headerCustomFilters, setHeaderCustomFilters] = useState([])
    const [activeFilters, setActiveFilters] = useState([])
    const [isRowsLoaded, setIsRowsLoaded] = useState(false)
    const [anchorElFilter, setAnchorElFilter] = useState(null)
    const [selectedFilter, setSelectedFilter] = useState('')
    const [searchValue, setSearchValue] = useState('')
    // useRefs
    const tableRef = useRef(null)
    const columnApi = useRef(null)
    // Default
    // Data
    const [rowData,setRowData] = useState([]);
    const [columnDefs,setColumnDefs] = useState([])

    const updateSortColumn = (colId) => {
        setHeaderCustomSortColumn(colId)
    }
    const updateSortDirection = (sortDir) => {
        setHeaderCustomSortDirection(sortDir)
    }

    const appendCustomFilter = (filter) => {
        // insert custom filter here
        setHeaderCustomFilters((prevData)=>({
            ...prevData,
            filter
        }))
    }

    const removeCustomFilter = (filter) => {
        // Remove custom filter here
        let newCustomFilters = []
        headerCustomFilters.map((curr)=> {
            if(curr === filter){
                // insert ignore here
            }else{
                // add to newCustomFilters
            }
        })
    }
// Header/Column Actions
    const SortColumn = async (col) => {
        // await ResetSort(col)
        let newColDef = col
        if(col.headerCustomSortColumn === col.column.colId){
            if(col.headerCustomSortDirection === 'asc'){
                return col.updateSortDirection('desc')
            }else if(col.headerCustomSortDirection === 'desc'){
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
        
        // return true
    }

    const CustomizedHeader = (col) => {
        console.log("Col: ",col)
        const [anchorEl, setAnchorEl] = useState(null)
        const [isHovered, setIsHovered] = useState(false)
        const [currentSort, setCurrentSort] = useState(false)
        useEffect(() => {
            if(col.headerCustomSortColumn === col.column.colId){
                setCurrentSort(true)
            }
        }, [col.headerCustomSortColumn])

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
        };
    
        const handlePopoverClose = () => {
            setAnchorEl(null);
        };
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
                        (!currentSort || col.headerCustomSortDirection === null )?
                        <>
                            <FontAwesomeIcon icon={faSort} style={{marginLeft:"auto" }}/>
                        </>
                            
                        : col.headerCustomSortDirection === 'desc' ?
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

    const isRowsEmpty = () => {
        if(rowData.length === 0 && isRowsLoaded){
            return true
        }else{
            return false
        }
    } 

    const isDataLoaded =() => {
        if(rowData.length >= 0 && isRowsLoaded){
            if(columnDefs.length >= 0 && isColumnsLoaded){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    }
    const constructFilter = (element) => {
        // Sort input type = autocomplete, default, checkbox, nested, ...
        let filterObject = {
            label:element.field.charAt(0).toUpperCase() + element.field.slice(1), 
            isActive:false,
            type:'default'
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
        console.log(filterObject)
        return filterObject
    }
    // update when component mounts
    useEffect(() => {
        if(columns){
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
                        console.log('hit')
                        let filterObject = constructFilter(element)
                        // default value
                        updatedArray = [...updatedArray,filterObject]
                    }
                    
                });
                setHeaderCustomFilters(updatedArray)
                setColumnDefs(newColumns)
                setIsColumnsLoaded(true)
            }
        }else{
        }
        
    }, [columns])
    useEffect(() => {
        console.log("Custom Filters: ",headerCustomFilters)
    }, [headerCustomFilters])
    useEffect(() => {
        console.log("selectedFilter: ",selectedFilter)
    }, [selectedFilter])
    

    useEffect(() => {
        if(rows){
            if(rows.length === 0){
                setRowData(rows)
                setIsRowsLoaded(true)
            }else if(rows.length > 0){
                setRowData(rows)
                setIsRowsLoaded(true)
            }
        }else{
        }
    }, [rows])

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value)
        // Insert Search
    }
    const handleSearchSubmit = (e) => {
        console.log("Search Value: ",searchValue)
    }
    
    const handlePopoverFilterClick = (e) => {
        setAnchorElFilter(e.currentTarget)
    }
    const handlePopoverFilterClose = () => {
        setAnchorElFilter(null)
    }
    const sampleClick = () => {
        console.log('click')
    }
    // filter
    const handleSelectedFilter = (e) => {
        setSelectedFilter(e.target.value)
    }
    return (
        <Grid container direction='column' justifyContent='center' style={{ height: '90vh', width: '90vw'}}>
            <Grid item xs style={{flex:0}}>
                <Grid container sx={{px:'1rem', py:'0.5rem'}}>
                    <Grid item xs={9} >
                    {/* If filter: */}
                    { headerCustomFilters.length > 0 && (
                        <Grid container alignItems="center" direction='row' style={{ marginBottom: hasSearch ? '0': '-1rem'}}>
                            <FontAwesomeIcon 
                                icon={faFilter} 
                                style={{
                                    color:'#4D4C53',
                                    fontSize:'20px'
                                }}
                            />
                            <Typography style={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', 
                                paddingLeft: '0.5rem',
                                textTransform:'none', 
                                // color:'black', 
                                fontSize:'17px'}}
                            >
                                Filter by: 
                            </Typography>
                            { //only display button if headerCustomFilter.length < activeFilters.length

                            }
                            <Button 
                                variant="contained" 
                                onClick={handlePopoverFilterClick} 
                                style={{
                                    backgroundColor:'#F1F0F3',
                                    color:'#4D4C53',
                                    marginLeft:'0.8rem', 
                                    maxWidth:'0.5rem', 
                                    minWidth:'0.5rem',
                                    borderRadius:'8px',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} style={{width:'1rem'}}/>
                            </Button>
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
                                <div style={{padding:'0.5rem 0 1rem 0',width:'15rem'}}>
                                    <div size="small" fullWidth style={{padding: '0.5rem 1rem 0.5rem 1rem', paddingLeft:'1.5rem', textTransform: "none", justifyContent:'flex-start',color:'black'}} >
                                        <Typography sx={{paddingBottom: '0.5rem',fontSize: '15px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 400}}>
                                            Filters:
                                        </Typography>
                                            <FormControl variant="outlined" fullWidth>
                                                <Select
                                                    labelId="filter-select"
                                                    id="filter-select"
                                                    fullWidth
                                                    size="small"
                                                    value={selectedFilter}
                                                    onChange={handleSelectedFilter}
                                                >
                                                    <MenuItem value={''} disabled>
                                                        <em>Filter</em>
                                                    </MenuItem>
                                                    { //loop for every active filter
                                                        headerCustomFilters.filter(obj => obj.isActive === false).map(element => (
                                                            <MenuItem value={element.label}>
                                                                {element.label}
                                                            </MenuItem>
                                                    )
                                                    )}
                                                </Select>
                                            </FormControl>
                                            {/* { !selectedFilter === '' ? //insert here filter type
                                                selectedFilter
                                            :
                                            <></>
                                            } */}
                                    </div >
                                </div>
                            </Popover>
                        </Grid>
                    )}
                    </Grid>
                    
                    {/* If has search */}
                    <Grid item xs={3}>
                        {hasSearch && (
                            <Grid container justifyContent='flex-end'>
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
                                            onMouseDown={handleSearchSubmit}
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
            <Grid item xs={true}>
                <div className="ag-theme-alpine" style={{height: '100%', width:'100%'}}>
                    <AgGridReact
                        ref={tableRef}
                        rowData={ rowData}
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

export default NewComponent