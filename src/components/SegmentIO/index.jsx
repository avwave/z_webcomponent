import { CircularProgress, makeStyles } from '@material-ui/core';
import { AnalyticsBrowser } from '@segment/analytics-next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [analyticsData, setAnalyticsData] = useState();
  const [loading, setLoading] = useState(true);
  const setupAnalytics = useCallback(
    async () => {
      try {
        const [analytics, analyticsContext] = await AnalyticsBrowser.load({ writeKey }, { obfuscate: true })
        setAnalyticsData(analytics)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    },
    [writeKey],
  );

  useEffect(
    () => {
      if (writeKey) {
        setupAnalytics()
      }
    }, [setupAnalytics, writeKey]
  );

  if(loading) {
    return <CircularProgress/>
  }
  return (
    <AnalyticsContext.Provider value={{ loading, analytics: analyticsData, appIdentifier }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

const useAnalytics = () => {

  const { loading, analytics, appIdentifier } = React.useContext(AnalyticsContext)
  const [analyticsLib, setAnalyticsLib] = useState(null);
  useEffect(
    () => {
      if (!loading) {
        setAnalyticsLib(analytics)
      }
    }, [loading]
  );

  const pageViewed = useCallback(
    (name, properties) => {
      analyticsLib?.page(appIdentifier, name, properties, COMMONPAYLOAD)
    },
    [analyticsLib],
  );

  const trackEvent = useCallback(
    async (eventName, properties) => {
      if (!analyticsLib) {
        return  //silent error, possible show disable tracking/adblock message
      }
      const aUser = await analyticsLib?.user()
      const id = await (aUser)?.id()
      const aId = await (aUser)?.anonymousId()
      const identifiers = {
        tempId: aId,
        id,
        user_id: id
      }
      const payload = filterNonNull({
        ...identifiers,
        ...properties,
        appIdentifier: appIdentifier
      })
      // console.log("SEG: 📢[index.jsx:56]: payload: ", payload);
      await analyticsLib?.track(eventName, payload, COMMONPAYLOAD)
    },
    [analyticsLib],
  );
  const aliasToV1 = useCallback(
    async (userId, forceClaim = false) => {
      if (!analyticsLib) {
        return  //silent error, possible show disable tracking/adblock message
      }
      const anonId = await (await analyticsLib?.user())?.anonymousId()
      if (forceClaim) {
        await analyticsLib?.alias(userId, COMMONPAYLOAD)
        return
      }
      if (!(sessionStorage.getItem("IDClaimed") === 'yes') && !!userId) {
        sessionStorage.setItem("IDClaimed", 'yes')
        await analyticsLib?.alias(userId, anonId, COMMONPAYLOAD)
      }
    },
    [analyticsLib],
  )

  const aliasTo = useCallback(
    async (userId) => {
      if (!analyticsLib) {
        return  //silent error, possible show disable tracking/adblock message
      }
      const anonId = await (await analyticsLib?.user())?.anonymousId()
      const aliau = await analyticsLib?.alias(userId, anonId, COMMONPAYLOAD)
    },
    [analyticsLib],
  )

  const identifyUsingIdAndTraitsV1 = useCallback(
    async (id, traits) => {
      if (!analyticsLib) {
        return  //silent error, possible show disable tracking/adblock message
      }
      const anonId = await (await analyticsLib?.user())?.anonymousId()
      const identity = id || anonId
      const identifiers = !!id ? { userId: id } : { tempId: identity }

      const payload = filterNonNull({
        ...identifiers,
        ...traits,
        appIdentifier: appIdentifier
      })
      const options = filterNonNull({
        ...COMMONPAYLOAD,
        anonymousId: anonId
      })
      await analyticsLib?.identify(identity, payload, options)
    },
    [analyticsLib],
  );

  const identifyUsingIdAndTraits = useCallback(
    async (id = null, traits) => {
      if (!analyticsLib) {
        return  //silent error, possible show disable tracking/adblock message
      }
      let identity = id
      let anonTraits = null

      const anonymousId = await (await analyticsLib?.user())?.anonymousId()
      const anonId = {
        anonymousId
      }

      if (id === null) {
        anonTraits = {
          tempId: identity
        }
      }

      const identifiers = { id }

      const payload = filterNonNull({
        ...identifiers,
        ...traits,
        ...anonTraits,
      })
      const options = filterNonNull({
        ...COMMONPAYLOAD,
        ...anonId
      })

      await analyticsLib?.identify(identity, payload, options)
      // console.log("SEG: 📢[index.jsx:117]: identUIdT: ", identUIdT);
    },
    [analyticsLib],
  );

  const identifyAnon = useCallback(
    async (traits) => {
      if (!analyticsLib) {
        return  //silent error, possible show disable tracking/adblock message
      }
      const anonId = await (await analyticsLib?.user())?.anonymousId()
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
        await analyticsLib?.identify(null, payload, options)
      }
    }, [analyticsLib]
  )


  const getAnonymousId = useCallback(
    async () => {
      if (!analyticsLib) {
        return  //silent error, possible show disable tracking/adblock message
      }
      try {
        const user = await analyticsLib?.user()
        return user?.anonymousId()
      } catch (e) {
        return null
      }
    },
    [analyticsLib],
  );

  const checkIsIdentified = useCallback(
    async () => {
      if (!analyticsLib) {
        return  //silent error, possible show disable tracking/adblock message
      }
      const user = await analyticsLib?.user()

      const id = await user?.id()
      return id
    },
    [analyticsLib],
  );

  const reset = useCallback(
    async () => {
      const user = await analyticsLib?.user()
      await user?.id(null)
      await user?.traits(null)
      // await identifyAnon()
    },
    [analyticsLib, identifyAnon],
  );

  const fullReset = useCallback(
    async () => {
      const anReset = await analyticsLib?.reset()
      // console.log("SEG: 📢[index.jsx:172]: anReset: ", anReset);
      // await setClaimed(false)
      // sessionStorage.removeItem("IDClaimed")
    },
    [analyticsLib],
  );

  return {
    getAnonymousId,
    reset,
    fullReset,
    analyticsLib,
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


