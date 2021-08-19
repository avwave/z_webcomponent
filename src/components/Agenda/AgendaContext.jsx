import React, { createContext, useReducer } from "react";

export const initState = {
  events:[],
  loading: false
};

export const actions = {
  LOAD_DATA: "LOAD_DATA",
  SET_LOADING: 'SET_LOADING',
  SET_DONE_LOADING: 'SET_DONE_LOADING'
};

export const AgendaContext = createContext(initState);

export function AgendaReducer(state, action) {
  switch (action.type) {
    case actions.SET_LOADING:
      return { ...state, loading: true };
    case actions.SET_DONE_LOADING:
      return { ...state, loading: false };
    case actions.LOAD_DATA:
      return { ...state, events: action.payload.events, summaries: action.payload.summaries };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const AgendaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AgendaReducer, initState);
  return (
    <AgendaContext.Provider value={[state, dispatch]}>
      {children}
    </AgendaContext.Provider>
  );
};

export default AgendaProvider;
