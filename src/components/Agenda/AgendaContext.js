import React, { createContext, useReducer } from "react";

export const initState = {
  events:[]
};

export const actions = {
  LOAD_DATA: "LOAD_DATA",
};

export const AgendaContext = createContext();

export function AgendaReducer(state, action) {
  console.log(
    "🚀 ~ file: AgendaContext.js ~ line 23 ~ AgendaReducer ~ state, action",
    state,
    action
  );
  switch (action.type) {
    case actions.LOAD_DATA:
      return { ...state, events: action.payload.events, summaries: action.payload.summaries };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const AgendaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AgendaReducer, initState);
  return (
    <AgendaContext.Provider value={[state, dispatch]}>
      {children}
    </AgendaContext.Provider>
  );
};

export default AgendaProvider;
