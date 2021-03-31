import React, { createContext, useReducer } from "react";

export const initState = {
  rows: [],
  columns: [],
  filterValue: "",
  filterColumn: "",
  sortColumn: "",
  sortDirection: ""
};

export const actions = {
  SORT_COLUMN: 'SORT_COLUMN',
  FILTER_COLUMN: 'FILTER_COLUMN',
  LOAD_ROWS: 'LOAD_ROWS',
  LOAD_COLUMNS: 'LOAD_COLUMNS',
  LOAD_DATA: 'LOAD_DATA'
};

export const DataGridContext = createContext();


export function dataGridReducer(state, action) {
  console.log("🚀 ~ file: DataGridContext.js ~ line 23 ~ dataGridReducer ~ state, action", state, action)
  switch (action.type) {
    case actions.LOAD_COLUMNS:
      return { ...state, columns:  action.payload.columns };
    case actions.LOAD_ROWS:
      return { ...state, rows: action.payload.rows };
    case actions.LOAD_DATA:
      return { ...state, ...action.payload};
    case actions.FILTER_COLUMN:
      return {
        ...state,
        filterColumn: action.payload.filterColumn,
        filterValue: action.payload.filterValue,
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
