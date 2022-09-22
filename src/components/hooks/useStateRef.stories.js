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
    alert(`ref Value: ${stateRef.current}`) // will show 1
  }
  useEffect(() => {
    alert(`useEffect: state value: ${stateRef.current}`) // Always show the last value
    return () => {
      alert(`exit useEffect: state value: ${stateRef.current}`) // Always show the last value
    }
  }, [])
  return (
    <div>
      State Value: {state}
      <Button onClick={increment}>
        Increment
      </Button>
    </div>)
}