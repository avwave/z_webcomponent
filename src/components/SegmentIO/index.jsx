import { makeStyles } from '@material-ui/core';
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


  return (
    <AnalyticsContext.Provider value={{ loading, analytics: analyticsData, appIdentifier }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

const useAnalytics = () => {

  const pageViewed = useCallback(
    (name, properties) => {
      const { loading, analytics, appIdentifier } = React.useContext(AnalyticsContext)
      analytics?.page(appIdentifier, name, properties, COMMONPAYLOAD)
    },
    [],
  );

  const trackEvent = useCallback(
    async (eventName, properties) => {
      const { loading, analytics, appIdentifier } = React.useContext(AnalyticsContext)
      if (!analytics) {
        return  //silent error, possible show disable tracking/adblock message
      }
      const aUser = await analytics?.user()
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
      await analytics?.track(eventName, payload, COMMONPAYLOAD)
    },
    [],
  );
  const aliasToV1 = useCallback(
    async (userId, forceClaim = false) => {
      const { loading, analytics, appIdentifier } = React.useContext(AnalyticsContext)
      if (!analytics) {
        return  //silent error, possible show disable tracking/adblock message
      }
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
    [],
  )

  const aliasTo = useCallback(
    async (userId) => {
      const { loading, analytics, appIdentifier } = React.useContext(AnalyticsContext)
      if (!analytics) {
        return  //silent error, possible show disable tracking/adblock message
      }
      const anonId = await (await analytics?.user())?.anonymousId()
      const aliau = await analytics?.alias(userId, anonId, COMMONPAYLOAD)
    },
    [],
  )

  const identifyUsingIdAndTraitsV1 = useCallback(
    async (id, traits) => {
      const { loading, analytics, appIdentifier } = React.useContext(AnalyticsContext)
      if (!analytics) {
        return  //silent error, possible show disable tracking/adblock message
      }
      const anonId = await (await analytics?.user())?.anonymousId()
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
      await analytics?.identify(identity, payload, options)
    },
    [],
  );

  const identifyUsingIdAndTraits = useCallback(
    async (id = null, traits) => {
      const { loading, analytics, appIdentifier } = React.useContext(AnalyticsContext)
      if (!analytics) {
        return  //silent error, possible show disable tracking/adblock message
      }
      let identity = id
      let anonTraits = null

      const anonymousId = await (await analytics?.user())?.anonymousId()
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

      await analytics?.identify(identity, payload, options)
      // console.log("SEG: 📢[index.jsx:117]: identUIdT: ", identUIdT);
    },
    [],
  );

  const identifyAnon = useCallback(
    async (traits) => {
      const { loading, analytics, appIdentifier } = React.useContext(AnalyticsContext)
      if (!analytics) {
        return  //silent error, possible show disable tracking/adblock message
      }
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
    }, []
  )


  const getAnonymousId = useCallback(
    async () => {
      const { loading, analytics, appIdentifier } = React.useContext(AnalyticsContext)
      if (!analytics) {
        return  //silent error, possible show disable tracking/adblock message
      }
      try {
        const user = await analytics?.user()
        return user?.anonymousId()
      } catch (e) {
        return null
      }
    },
    [],
  );

  const checkIsIdentified = useCallback(
    async () => {
      const { loading, analytics, appIdentifier } = React.useContext(AnalyticsContext)
      if (!analytics) {
        return  //silent error, possible show disable tracking/adblock message
      }
      const user = await analytics?.user()

      const id = await user?.id()
      return id
    },
    [],
  );

  const reset = useCallback(
    async () => {
      const { loading, analytics, appIdentifier } = React.useContext(AnalyticsContext)
      const user = await analytics?.user()
      await user?.id(null)
      await user?.traits(null)
      // await identifyAnon()
    },
    [],
  );

  const fullReset = useCallback(
    async () => {
      const { loading, analytics, appIdentifier } = React.useContext(AnalyticsContext)
      const anReset = await analytics?.reset()
      // console.log("SEG: 📢[index.jsx:172]: anReset: ", anReset);
      // await setClaimed(false)
      // sessionStorage.removeItem("IDClaimed")
    },
    [],
  );

  return {
    getAnonymousId,
    reset,
    fullReset,
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


