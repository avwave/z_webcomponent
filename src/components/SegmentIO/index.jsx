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

  const [claimed, setClaimed] = useLocalStorage("IDClaimed", null);


  const analytics = React.useContext(AnalyticsContext)
  if (!analytics) {
    throw new Error('useAnalytics must be used within a AnalyticsProvider')
  }

  const pageViewed = useCallback(
    (name) => {
      analytics?.page(analytics?.appIdentifier, name)
    },
    [analytics],
  );

  const trackEvent = useCallback(
    async (eventName, properties) => {
      const aUser = await analytics?.user()
      const id = await (aUser)?.id()
      const aId = await (aUser)?.anonymousId()
      const identifiers = (!!id && aId === id) ? { tempId: aId } : { id }
      analytics?.track(eventName, { ...identifiers, ...properties, appIdentifier: analytics?.appIdentifier }, COMMONPAYLOAD)
    },
    [analytics],
  );

  const mergeIdentity = useCallback(
    async (userId) => {
      if (!claimed && !!userId) {
        setClaimed(true)
        await analytics?.alias(userId, COMMONPAYLOAD)
      }
    },
    [analytics, claimed, setClaimed],
  )

  const identifyUser = useCallback(
    async (id, traits) => {
      const anonId = await (await analytics?.user())?.anonymousId()
      const identity = id || anonId
      const identifiers = !!id ? { id } : { tempId: identity }
      await analytics?.identify(identity, { ...identifiers, ...traits, appIdentifier: analytics?.appIdentifier }, {
        ...COMMONPAYLOAD,
        anonymousId: anonId
      })
      // await mergeIdentity(id)
    },
    [analytics, mergeIdentity],
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
      await identifyUser(null)
    },
    [analytics, identifyUser],
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
    identifyUser,
    mergeIdentity,
    checkIsIdentified
  }
}

export { AnalyticsProvider, useAnalytics };


