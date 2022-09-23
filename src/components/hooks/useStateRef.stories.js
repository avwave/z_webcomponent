import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useStateRef } from './useStateRef';


const useStateRefStory = {
  title: "Hooks/useStateRef",
};

export default useStateRefStory;

export const Default = ({ ...args }) => {
  var [state, setState, stateRef] = useStateRef(0)
  function increment() {
    setState(state + 1)
    console.log(`ref Value: ${stateRef.current}`)
  }
  useEffect(() => {
    console.log(`useEffect: state value: ${stateRef.current}`)
    return () => {

    }
  }, [])
  return (
    <div>
      <p>
        <em>Check console.log for order of values</em>
      </p>

      State Value: {state}
      <Button variant="contained" onClick={increment}>
        Increment
      </Button>
    </div>)
}