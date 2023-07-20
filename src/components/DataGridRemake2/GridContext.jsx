import {createContext, useReducer} from 'react'

export const initialState = {
    columns: [],
    rows:[],
    loading: false,
    sortColumn: null,
    sortDirection: null,
    filterColumns: [],
    search: null
}

export const actions ={
    RESET_GRID:'RESET_GRID',
    SORT_COLUMN: 'SORT_COLUMN',
    FILTER_COLUMN: 'FILTER_COLUMN',
    CLEAR_FILTER_COLUMN:'CLEAR_FILTER_COLUMN',
    LOAD_COLUMNS: 'LOAD_COLUMNS',
    LOAD_ROWS: 'LOAD_ROWS',
    SET_LOADING: 'SET_LOADING',
    SET_LOADING_DONE: 'SET_LOADING_DONE',
    SET_SEARCH: 'SET_SEARCH',
    TEST_DISPATCH: 'TEST_DISPATCH'
}

export const GridContext = createContext()

export function gridReducer(state,action){
    switch (action.type) {
        case actions.TEST_DISPATCH:
            return {...state}
        case actions.SET_SEARCH:
            return {
                ...state,
                search: action.payload.search
            }
        case actions.SORT_COLUMN:
            return {
                ...state,
                sortColumn: action.payload.sortColumn
            }
        case actions.SORT_DIRECTION:
            return {
                ...state,
                sortDirection: action.payload.sortDirection
            }
        case actions.FILTER_COLUMN:
            return {
                ...state,
                filterColumns: action.payload.filterColumns ?? []
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
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}


