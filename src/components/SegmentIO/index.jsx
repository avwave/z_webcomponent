import { makeStyles } from '@material-ui/core';
import { AnalyticsBrowser } from '@segment/analytics-next';
import React, { useCallback, useMemo } from 'react';
import useLocalStorage from "use-local-storage";

export function filterNonNull(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => !(v === null || v === undefined)));
};

const useStyles = makeStyles((theme) => {
  return {}
})

const AnalyticsContext = React.createContext(null)

const COMMONPAYLOAD = {
  integrations: {
    All: true,
  }
}

const AnalyticsProvider = ({ children, writeKey, appIdentifier }) => {
  const analytics = useMemo(
    () => {
      const analytics = AnalyticsBrowser.load({ writeKey })
      return analytics
    }, [writeKey]
  );

  return (
    <AnalyticsContext.Provider value={{analytics, appIdentifier}}>
      {children}
    </AnalyticsContext.Provider>
  )
}

const useAnalytics = () => {

  const {analytics, appIdentifier} = React.useContext(AnalyticsContext)
  if (!analytics) {
    throw new Error('useAnalytics must be used within a AnalyticsProvider')
  }

  const pageViewed = useCallback(
    (name, properties) => {
      analytics?.page(appIdentifier, name, properties, COMMONPAYLOAD)
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
        id,
        userId: id
      }
      const payload = filterNonNull({
        ...identifiers,
        ...properties,
        appIdentifier: appIdentifier
      })
      console.log("SEG: 📢[index.jsx:56]: payload: ", payload);
      await analytics?.track(eventName, payload, COMMONPAYLOAD)
    },
    [analytics],
  );
  const aliasToV1 = useCallback(
    async (userId, forceClaim = false) => {
      const anonId = await (await analytics?.user())?.anonymousId()
      if (forceClaim) {
        await analytics?.alias(userId, COMMONPAYLOAD)
        return
      }
      if (!(sessionStorage.getItem("IDClaimed") === 'yes') && !!userId) {
        sessionStorage.setItem("IDClaimed", 'yes')
        await analytics?.alias(userId, anonId, COMMONPAYLOAD)
      }
    },
    [analytics],
  )

  const aliasTo = useCallback(
    async (userId) => {
      const anonId = await (await analytics?.user())?.anonymousId()
      const aliau = await analytics?.alias(userId, anonId, COMMONPAYLOAD)
    },
    [analytics],
  )

  const identifyUsingIdAndTraitsV1 = useCallback(
    async (id, traits) => {
      const anonId = await (await analytics?.user())?.anonymousId()
      const identity = id || anonId
      const identifiers = !!id ? { userId:id } : { tempId: identity }

      const payload = filterNonNull({
        ...identifiers,
        ...traits,
        appIdentifier: appIdentifier
      })
      const options = filterNonNull({
        ...COMMONPAYLOAD,
        anonymousId: anonId
      })
      await analytics?.identify(identity, payload, options)
    },
    [analytics],
  );

  const identifyUsingIdAndTraits = useCallback(
    async (id, traits) => {
      const identity = id
      const identifiers = { id }

      const payload = filterNonNull({
        ...identifiers,
        ...traits,
        appIdentifier: appIdentifier
      })
      const options = {
        ...COMMONPAYLOAD,
      }
      const identUIdT = await analytics?.identify(identity, payload, options)
      console.log("SEG: 📢[index.jsx:117]: identUIdT: ", identUIdT);
    },
    [analytics],
  );

  const identifyAnon = useCallback(
    async (traits) => {
      const anonId = await (await analytics?.user())?.anonymousId()
      const payload = {
        tempId: anonId,
        ...traits,
        appIdentifier: appIdentifier
      }
      const options = {
        ...COMMONPAYLOAD,
      }
      if (!(sessionStorage.getItem("IDClaimed") === 'yes')) {
        sessionStorage.setItem("IDClaimed", 'yes')
        await analytics?.identify(null, payload, options)
      }
    }, [analytics]
  )


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
      await identifyAnon()
    },
    [analytics, identifyAnon],
  );

  const fullReset = useCallback(
    async () => {
      const anReset = await analytics?.reset()
      console.log("SEG: 📢[index.jsx:172]: anReset: ", anReset);
      // await setClaimed(false)
      // sessionStorage.removeItem("IDClaimed")
    },
    [analytics],
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
    checkIsIdentified,
    identifyAnon
  }
}

export { AnalyticsProvider, useAnalytics };


