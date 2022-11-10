import { makeStyles } from '@material-ui/core';
import { AnalyticsBrowser } from '@segment/analytics-next';
import React, { useCallback, useMemo } from 'react';
import useLocalStorage from "use-local-storage";

const useStyles = makeStyles((theme) => {
  return {}
})

const AnalyticsContext = React.createContext(null)

const AnalyticsProvider = ({ children, writeKey, appIdentifier }) => {
  const analytics = useMemo(
    () => {
      const analytics = { ...AnalyticsBrowser.load({ writeKey }), appIdentifier }
      return analytics
    }, [writeKey]
  );

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  )
}

const COMMONPAYLOAD = {
  integrations: {
    All: true,
  }
}
const useAnalytics = () => {



  const analytics = React.useContext(AnalyticsContext)
  if (!analytics) {
    throw new Error('useAnalytics must be used within a AnalyticsProvider')
  }

  const pageViewed = useCallback(
    (name, properties) => {
      analytics?.page(analytics?.appIdentifier, name, properties, COMMONPAYLOAD)
    },
    [analytics],
  );

  const trackEvent = useCallback(
    async (eventName, properties) => {
      const aUser = await analytics?.user()
      const id = await (aUser)?.id()
      const aId = await (aUser)?.anonymousId()
      const identifiers = {
        tempId: aId,
        id
      }
      const payload = {
        ...identifiers,
        ...properties,
        appIdentifier: analytics?.appIdentifier
      }
      console.log("📢[index.jsx:56]: payload: ", payload);
      analytics?.track(eventName, payload, COMMONPAYLOAD)
    },
    [analytics],
  );
  const [claimed, setClaimed] = useLocalStorage("IDClaimed", null);
  const aliasToV1 = useCallback(
    async (userId, forceClaim = false) => {
      if (forceClaim) {
        await analytics?.alias(userId, COMMONPAYLOAD)
        return
      }
      if (!claimed && !!userId) {
        setClaimed(true)
        await analytics?.alias(userId, COMMONPAYLOAD)
      }
    },
    [analytics, claimed, setClaimed],
  )

  const aliasTo = useCallback(
    async (userId) => {
      await analytics?.alias(userId, COMMONPAYLOAD)
    },
    [analytics],
  )

  const identifyUsingIdAndTraitsV1 = useCallback(
    async (id, traits) => {
      const anonId = await (await analytics?.user())?.anonymousId()
      const identity = id || anonId
      const identifiers = !!id ? { id } : { tempId: identity }

      const payload = {
        ...identifiers,
        ...traits,
        appIdentifier: analytics?.appIdentifier
      }
      const options = {
        ...COMMONPAYLOAD,
        anonymousId: anonId
      }
      await analytics?.identify(identity, payload, options)
    },
    [analytics],
  );

  const identifyUsingIdAndTraits = useCallback(
    async (id, traits) => {
      const anonId = await (await analytics?.user())?.anonymousId()
      const identity = id || anonId
      const identifiers = !!id ? { id } : { tempId: identity }

      const payload = {
        ...identifiers,
        ...traits,
        appIdentifier: analytics?.appIdentifier
      }
      const options = {
        ...COMMONPAYLOAD,
      }
      await analytics?.identify(identity, payload, options)
    },
    [analytics],
  );



  const getAnonymousId = useCallback(
    async () => {
      const user = await analytics?.user()
      return user?.anonymousId()
    },
    [analytics],
  );

  const checkIsIdentified = useCallback(
    async () => {
      const user = await analytics?.user()

      const id = await user?.id()
      return id
    },
    [analytics],
  );

  const reset = useCallback(
    async () => {
      const user = await analytics?.user()
      await user?.id(null)
      await user?.traits(null)
      // await identifyUsingIdAndTraits(null)
    },
    [analytics, identifyUsingIdAndTraits],
  );

  const fullReset = useCallback(
    async () => {
      await analytics?.reset()
      await setClaimed(false)
      await reset()
    },
    [analytics, reset, setClaimed],
  );

  return {
    getAnonymousId,
    reset,
    fullReset,
    analytics,
    pageViewed,
    trackEvent,
    identifyUsingIdAndTraits,
    identifyUsingIdAndTraitsV1,
    aliasTo,
    aliasToV1,
    checkIsIdentified
  }
}

export { AnalyticsProvider, useAnalytics };


