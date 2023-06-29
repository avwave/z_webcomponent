import React, {createContext, useReducer} from 'react'

export const initialState = {
    columns: [],
    rows:[],
    sortColumn: null,
    sortDirection: null,
    filterColumns: [],
    loading: false,
}

export const GridContext = createContext([initialState,undefined])

export const actions ={
    RESET_GRID:'RESET_GRID',
    SORT_COLUMN: 'SORT_COLUMN',
    FILTER_COLUMN: 'FILTER_COLUMN',
    CLEAR_FILTER_COLUMN:'CLEAR_FILTER_COLUMN',
    LOAD_COLUMNS: 'LOAD_COLUMNS',
    LOAD_ROWS: 'LOAD_ROWS',
    SET_LOADING: 'SET_LOADING',
    SET_LOADING_DONE: 'SET_LOADING_DONE'
}

export const gridReducer = (state,action) => {  
    switch (action.type) {
        case actions.SORT_COLUMN:
            return {
                ...state
            }
        case actions.FILTER_COLUMN:
            return {
                ...state
            }
        case actions.CLEAR_FILTER_COLUMN:
            return {
                ...state
            }
        case actions.LOAD_COLUMNS:
            return {
                ...state,
                columns: action.payload.columns
            }
        case actions.LOAD_ROWS:
            return {
                ...state,
                rows: action.payload.rows
            }
        case actions.SET_LOADING:
            return {
                ...state,
                loading: true
            }
        case actions.SET_LOADING_DONE:
            return {
                ...state,
                loading: false
            }
        default:
            break;
    }
}

const GridProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gridReducer, initialState)
    return (
        <GridContext.Provider value={[state,dispatch]}> 
            {children}
        </GridContext.Provider>
    )
}

export default GridProvider