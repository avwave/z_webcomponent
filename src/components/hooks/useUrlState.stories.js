import React, { useEffect } from "react";
import { action, actions } from "@storybook/addon-actions";

import ReactJsonView from 'react-json-view';
import { TextField } from "@mui/material";
import { DateTimeRangePicker } from "../DateTimeRangePicker";
import { DatePicker } from "@material-ui/pickers";
import { useUrlState } from "./useUrlState";

const useURLStateStory = {
  title: "Hooks/useUrlState",
};

export default useURLStateStory;

export const Default = ({ ...args }) => {
  const [queryTerm, setQueryTerm, queryTermRef] = useUrlState({queryKey:'queryTerm'});
  return (
    <div>
      <TextField
        variant="standard"
        label="Query Term"
        value={queryTerm}
        onChange={(e) => setQueryTerm(e.target.value)} />
      {queryTerm}
    </div>
  );
};

export const Disable = ({ ...args }) => {
  const [queryTerm, setQueryTerm, queryTermRef] = useUrlState({queryKey:'queryTerm', disable: true});
  return (
    <div>
      <TextField
        variant="standard"
        label="Query Term"
        value={queryTerm}
        onChange={(e) => setQueryTerm(e.target.value)} />
      {queryTerm}
    </div>
  );
};

export const Multiple = ({ ...args }) => {
  const [queryTerm, setQueryTerm, queryTermRef] = useUrlState({queryKey:'queryTerm'});
  const [queryTerm2, setQueryTerm2, queryTerm2Ref] = useUrlState({queryKey:'queryTerm2'});
  useEffect(() => {
    console.log('should only be called once per load', queryTerm, queryTerm2)
  }, [queryTerm, queryTerm2]);
  return (
    <div>
      <TextField
        variant="standard"
        label="Query Term"
        value={queryTerm}
        onChange={(e) => setQueryTerm(e.target.value)} />
      <TextField
        variant="standard"
        label="Query Term 2"
        value={queryTerm2}
        onChange={(e) => setQueryTerm2(e.target.value)} />
      <ReactJsonView src={{queryTerm, queryTerm2}}/>
    </div>
  );
};

export const JSON = ({ ...args }) => {
  const [queryTerm, setQueryTerm, queryTermRef] = useUrlState({queryKey:'jsonTerm'});
  return (
    <div>
      <TextField
        variant="standard"
        label="Query Term"
        value={queryTerm?.wrap?.value}
        onChange={(e) => setQueryTerm({ wrap: { value: e.target.value } })} />
      <ReactJsonView src={{ queryTerm }} />
    </div>
  );
}

export const DateRange = ({ ...args }) => {
  const [queryTerm, setQueryTerm, queryTermRef] = useUrlState({queryKey:'dateRangeTerm'});
  return (
    <div>
      <DateTimeRangePicker value={queryTerm} onChange={v => setQueryTerm(v)} />
      <ReactJsonView src={{ queryTerm }} />
    </div>
  )
}
export const Date = ({ ...args }) => {
  const [queryTerm, setQueryTerm, queryTermRef] = useUrlState({queryKey:'dateTerm'});
  return (
    <div>
      <input type={"date"} value={queryTerm} onChange={v => {
        setQueryTerm(v.target.value)
      }} />
      <ReactJsonView src={{ queryTerm }} />
    </div>
  )
}