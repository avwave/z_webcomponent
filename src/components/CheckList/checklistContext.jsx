import React, { createContext, useReducer } from "react";
import { status } from "../Checkbox/Checkbox";

const initState = {
  items: [],
};

export const actions = {
  TOGGLE_ITEM: "TOGGLE_ITEM",
  LOAD_ITEMS: "LOAD_ITEMS",
};

export const CheckboxContext = createContext([]);

export function toggleItem(itemId, items) {
  return items.map((item) => {
    if (item.id === itemId) {
      item.state =
        item.state === status.UNCHECKED ? status.CHECKED : status.UNCHECKED;
    }
    return item;
  });
}

export function checkboxReducer(state, action) {
  switch (action.type) {
    case actions.LOAD_ITEMS:
      return { ...state, items: action.payload.items };
    case actions.TOGGLE_ITEM:
      return { ...state, items: toggleItem(action.payload.id, state.items) };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}


const CheckboxProvider = ({ children }) => {
  const [state, dispatch] = useReducer(checkboxReducer, initState);
  return (
    <CheckboxContext.Provider value={[state, dispatch]}>
      {children}
    </CheckboxContext.Provider>
  );
};

export default CheckboxProvider;
