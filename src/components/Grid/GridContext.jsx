import React, { createContext, useReducer } from "react";

const initState = {
  columns: [],
  onColumnSelect: () => {},
};

export const actions = {
  HEADER_CLICK: "HEADER_CLICK",
  CELL_CLICK: "CELL_CLICK",
  LOAD_COLUMNS: "LOAD_COLUMNS",
  LOAD_COLUMN: "LOAD_COLUMN",
  SET_ONCOLUMNSELECT: "SET_ONCOLUMNSELECT",
};

export const GridContext = createContext([]);

function cellClick(gridItems, cellId) {
  const gc = gridItems.map((column) => {
    column.items = column.items.map((item) => {
      item.selected = item.id === cellId;
      return item;
    });
    return column;
  });
  return gc;
}

export function gridReducer(state, action) {
  switch (action.type) {
    case actions.SET_ONCOLUMNSELECT:
      return { ...state, onColumnSelect: action.payload.onColumnSelect}
    case actions.LOAD_COLUMNS:
      return { ...state, columns: action.payload.columns };
    case actions.CELL_CLICK:
      return {
        ...state,
        columns: cellClick(state.columns, action.payload.cellId),
      };
    case actions.HEADER_CLICK:
      return { ...state };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const GridProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gridReducer, initState);
  return (
    <GridContext.Provider value={[state, dispatch]}>
      {children}
    </GridContext.Provider>
  );
};

export default GridProvider;
