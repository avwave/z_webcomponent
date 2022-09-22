import { Button } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";

import ReactJsonView from 'react-json-view';
import { useInterval } from '../../index';

const useIntervalStory = {
  title: "Hooks/useInterval",
};

export default useIntervalStory;

export const Default = ({ ...args }) => {
  const [log, setLog] = useState([]);

  const [isCleared, clear] = useInterval({ fn: () => processInterval(), delay: 3000 });

  useEffect(() => {
    return () => {
      clear()
    }
  }, []);

  const processInterval = useCallback(
    () => {
      const newDate = new Date()
      console.log('processInterval called', newDate)
      setLog((log) => [...log, newDate]);
    },
    [],
  );

  return (
    <ReactJsonView src={{ isCleared, log }} />
  )
};

export const ClearInterval = ({ ...args }) => {
  const [log, setLog] = useState([]);

  const [isCleared, stopInterval] = useInterval({ fn: () => processInterval(), delay: 1000 });

  useEffect(() => {
    return () => {
      stopInterval()
    }
  }, []);

  const processInterval = useCallback(
    () => {
      const newDate = new Date()
      console.log('processInterval called', newDate)
      setLog((log) => [...log, newDate]);
    },
    [],
  );

  return (
    <>
      <ReactJsonView src={{ isCleared, log }} />
      <Button onClick={() => stopInterval()}>Stop Interval</Button>
    </>
  )
};

export const PauseResume = ({ ...args }) => {
  const [log, setLog] = useState([]);

  const [isCleared, stopInterval, pauseInterval] = useInterval({
    fn: () => processInterval(), delay: 1000,
  });

  const [paused, setPaused] = useState(false);
  useEffect(() => {
    return () => {
      stopInterval()
    }
  }, []);

  const processInterval = useCallback(
    () => {
      const newDate = new Date()
      console.log('processInterval called', newDate.toISOString())
      setLog((log) => [...log, newDate.toISOString()]);
    },
    [],
  );

  return (
    <>
      <Button onClick={() => stopInterval()}>Stop Interval</Button>
      <Button onClick={() => {
        pauseInterval()
        setPaused(!paused)
      }}>{paused ? 'Resume' : 'Pause'} Interval</Button>
      <ReactJsonView src={{ isCleared, log }} />
    </>
  )
};

export const MDXExample = ({ ...args }) => {
  const [log, setLog] = useState([]);

  const [isCleared, stopInterval, pauseInterval] = useInterval({
    fn: () => processInterval(), 
    delay: 1000,
    autoStart: false,
  });

  const [paused, setPaused] = useState(true);
  useEffect(() => {
    return () => {
      stopInterval()
    }
  }, []);

  const processInterval = useCallback(
    () => {
      const newDate = new Date()
      console.log('processInterval called', newDate.toISOString())
      setLog((log) => [...log, newDate.toISOString()]);
    },
    [],
  );

  return (
    <>
      <Button onClick={() => {
        pauseInterval()
        setPaused(!paused)
      }}>{paused ? 'Resume' : 'Pause'} Interval</Button>
      <ReactJsonView src={{ isCleared, log }} />
    </>
  )
};