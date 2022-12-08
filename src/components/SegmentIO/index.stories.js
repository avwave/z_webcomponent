import React, { useCallback, useEffect } from "react";
import { AnalyticsProvider, useAnalytics } from ".";
import { useState } from '../DataGrid2/stateref';
import ReactJsonView from 'react-json-view';
import { withReactContext } from "storybook-react-context";
import { Button } from "@mui/material";

const SegmentIOStory = {

  title: "SegmentIO",
  decorators: [
    withReactContext(),
    (Story) => (
      <AnalyticsProvider writeKey='kBESU3nop3e0nTVniD0rIKSvOGjvz64T' appIdentifier='STORYBOOK'>
        <Story />
      </AnalyticsProvider>
    ),
  ],
};

export default SegmentIOStory;

const DefaultStory = ({ ...args }) => {
  const {
    getAnonymousId
  } = useAnalytics()

  const [ident, setIdent] = useState();

  const identify = useCallback(
    async () => {
      const i = await getAnonymousId()
      console.log('index.stories.js (31) # i', i);
      setIdent(i)
    },
    [getAnonymousId],
  );
  useEffect(() => {
    identify()
  }, []);

  return (
    <ReactJsonView src={{ ident }} />
  )
}

export const Default = DefaultStory.bind({});
Default.args = {

}


const IdentifyAnonStory = ({ ...args }) => {
  const {
    identifyUsingIdAndTraits
  } = useAnalytics()

  const [ident, setIdent] = useState();

  const identify = useCallback(
    async () => {
      const i = await identifyUsingIdAndTraits()
      console.log('index.stories.js (31) # i', i);
      setIdent(i)
    },
    [identifyUsingIdAndTraits],
  );
  return (
    <>
      <ReactJsonView src={{ ident }} />
      <Button onClick={() => identify()}>Identify</Button>
    </>

  )
}

export const IdentifyAnon = IdentifyAnonStory.bind({});

const MergeIdentityStory = ({ ...args }) => {
  const {
    aliasTo,
    identifyUsingIdAndTraits,
    getAnonymousId
  } = useAnalytics()
  const [ident, setIdent] = useState();

  const merge = useCallback(
    async (id) => {
      await identifyUsingIdAndTraits(id)
      const i = await getAnonymousId()
      console.log('index.stories.js (31) # i', i);
      setIdent(i)
    },
    [getAnonymousId, identifyUsingIdAndTraits, aliasTo],
  );

  return (
    <>
      <ReactJsonView src={{ ident }} />
      <Button onClick={() => merge('1647')}>Merge '1647'</Button>
      <Button onClick={() => merge('1600')}>Merge '1600'</Button>
    </>
  )
}

export const MergeIdentity = MergeIdentityStory.bind({});

const ResetStory = ({ ...args }) => {
  const {
    reset,
    fullReset,
    getAnonymousId
  } = useAnalytics()
  const [ident, setIdent] = useState();
  const [newIdent, setNewIdent] = useState();

  const getAnon = useCallback(
    async () => {
      const i = await getAnonymousId()
      setIdent(i)
    },
    [getAnonymousId],
  );

  useEffect(() => {
    getAnon()

    return () => {

    }
  }, []);

  const doReset = useCallback(
    async () => {
      await reset()
      const i = await getAnonymousId()
      setNewIdent(i)
    },
    [getAnonymousId, reset],
  );
  const doFullReset = useCallback(
    async () => {
      await fullReset()
      const i = await getAnonymousId()
      setNewIdent(i)
    },
    [fullReset, getAnonymousId],
  );

  return (
    <>
      <ReactJsonView src={{ ident, newIdent }} />
      <Button onClick={() => doReset()}>Reset</Button>
      <Button onClick={() => doFullReset()}>Reset Everything (unclaim)</Button>
    </>
  )
}

export const Reset = ResetStory.bind({});


const TrackEventStory = ({ ...args }) => {
  const {
    trackEvent,
    reset,
    checkIsIdentified
  } = useAnalytics()

  const track = useCallback(
    () => {
      trackEvent('TEST_EVENT', { payload: 'test' })
    },
    [trackEvent],
  );

  const [isIdent, setIsIdent] = useState();

  const isIdentified = useCallback(
    async () => {
      const isid = await checkIsIdentified()
      setIsIdent(isid)
    },
    [checkIsIdentified],
  );

  useEffect(() => {
    isIdentified()
  }, []);

  return (
    <>
      <ReactJsonView src={{ isIdent }} />
      <Button onClick={() => track()}>Track Button Event{!isIdent && ' Anonymously'}</Button>
      <Button disabled={!isIdent} onClick={async () => {
        await reset()
        isIdentified()
      }}>Reset</Button>
    </>
  )
}

export const TrackEvent = TrackEventStory.bind({});

const TrackPageStory = ({ ...args }) => {
  const {
    pageViewed,
    reset,
    fullReset,
    checkIsIdentified
  } = useAnalytics()

  const [isIdent, setIsIdent] = useState();

  const isIdentified = useCallback(
    async () => {
      const isid = await checkIsIdentified()
      setIsIdent(isid)
    },
    [checkIsIdentified],
  );

  useEffect(() => {
    isIdentified()
  }, []);

  useEffect(() => {
    pageViewed('Trackpagestory')

  }, []);

  return (
    <>
      <ReactJsonView src={{ isIdent }} />
      <Button disabled={!isIdent} onClick={async () => {
        await reset()
        isIdentified()
      }}>Reset</Button>
      <Button disabled={!isIdent} onClick={async () => {
        await fullReset()
        isIdentified()
      }}>Reset Everything (unclaim)</Button>
    </>
  )
}

export const TrackPage = TrackPageStory.bind({});


