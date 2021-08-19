import React, { createContext, useReducer } from "react";

export const initState = {
  rows: [],
  columns: [],
  filterColumn: {},
  sortColumn: null,
  sortDirection: null,
  loading: false,
};

export const actions = {
  SORT_COLUMN: 'SORT_COLUMN',
  FILTER_COLUMN: 'FILTER_COLUMN',
  LOAD_ROWS: 'LOAD_ROWS',
  LOAD_COLUMNS: 'LOAD_COLUMNS',
  LOAD_DATA: 'LOAD_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_DONE_LOADING: 'SET_DONE_LOADING',
  CLEAR_FILTER_COLUMN: 'CLEAR_FILTER_COLUMN'
};

export const DataGridContext = createContext([]);

function setDefaultFilterValues(columns, filterColumns) {
  const keystore = Object.keys(filterColumns)
  const keys = keystore.map(keyItem => {
    const colKey = columns.find( ({key}) => key===keyItem)
    return [keyItem, colKey?.filter?.default]
  })
  const newKeys = Object.fromEntries(keys)
  return newKeys
}

export function dataGridReducer(state, action) {
  switch (action.type) {
    case actions.SET_LOADING:
      return { ...state, loading: true };
    case actions.SET_DONE_LOADING:
      return { ...state, loading: false };
    case actions.LOAD_COLUMNS:
      return { ...state, columns:  action.payload.columns };
    case actions.LOAD_ROWS:
      return { ...state, rows: action.payload.rows};
    case actions.LOAD_DATA:
      return { ...state, ...action.payload};
    case actions.FILTER_COLUMN:
      return {
        ...state,
        filterColumn: action.payload.filterColumn??{},
      };
    case actions.CLEAR_FILTER_COLUMN:
      const filters = setDefaultFilterValues(state.columns, state.filterColumn)
      return {
        ...state,
        filterColumn: filters,
      };
    case actions.SORT_COLUMN:
      return {
        ...state,
        sortColumn: action.payload.sortColumn,
        sortDirection: action.payload.sortDirection,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const DataGridProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataGridReducer, initState);
  return (
    <DataGridContext.Provider value={[state, dispatch]}>
      {children}
    </DataGridContext.Provider>
  );
};

export default DataGridProvider;
