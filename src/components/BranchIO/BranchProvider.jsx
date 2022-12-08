import makeStyles from '@mui/styles/makeStyles';
import branchSdk from 'branch-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';

const useStyles = makeStyles((theme) => {
  return {}
})

const BranchProvider = ({ apiKey, children, ...props }) => {
  const branchOptions = {
    tracking_disabled: false
  }
  const [branchData, setBranchData] = useState(undefined);
  const [branchStatus, setBranchStatus] = useState(undefined);
  const [branchIdentity, _setBranchIdentity] = useState(undefined);

  const branchInitCallback = useCallback(
    (evt, data) => {
      setBranchData(data);
    },
    [],
  );

  const journeyStatusCallback = useCallback(
    (evt, data) => {
      setBranchStatus({ data, evt });
    },
    [],
  );

  const closeJourney = useCallback(
    () => {
      branchSdk.closeJourney(journeyStatusCallback);
    },
    [journeyStatusCallback],
  );

  const openJourney = useCallback(
    () => {
      branchSdk.track('pageview', journeyStatusCallback);
    },
    [journeyStatusCallback],
  );

  const logEvent = useCallback(
    (eventName, eventPayload) => {
      branchSdk.logEvent(eventName, eventPayload, journeyStatusCallback);
    },
    [journeyStatusCallback],
  );

  const setBranchIdentity = useCallback(
    (identity) => {
      branchSdk.setIdentity(identity, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

      });
    },
    [],
  );

  const fetchBranchIdentity = useCallback(
    () => {
      if (window.sessionStorage) {
        const identity = window.sessionStorage.getItem('branch_session');
        if (identity) {
          return identity;
        }
      }
    },
    [],
  );

  const hasIdentity = useMemo(() => {
    if (window.sessionStorage) {
      try {
        const parsedIdent = JSON.parse(fetchBranchIdentity())
        if (parsedIdent) {
          return !!parsedIdent?.identity;
        }
        return false
      } catch (error) {
        console.error(error);
        return false
      }
      
    } 
  }, [fetchBranchIdentity]);

  const getBranchIdentity = useMemo(() => {
    try {
      return JSON.parse(fetchBranchIdentity())
    } catch (error) {
      console.error(error);
      return null
    }
  }, [fetchBranchIdentity]);


  const branchLogout = useCallback(
    () => {
      branchSdk.logout(
        (err)=>{
          if (err) {
            console.error(err);
            return;
          }
        }
      )
    },
    [],
  );

  const [deepLink, setDeepLink] = useState(undefined);
  const generateDeeplink = useCallback(
    (payload={}) => {
      const {campaign='default campaign', channel='web', feature='', stage='', tags=[], data={}} = payload
      branchSdk.link({
        campaign,
        channel,
        feature,
        stage,
        tags,
        data
      }, (err, link) => {
        if (!err) {
          setDeepLink(link);
        }
      })
    },
    [],
  );

  useEffect(() => {
    branchSdk.init(apiKey, branchOptions, branchInitCallback);
    console.log('BranchProvider.jsx (22)', 'init branch')
  }, [apiKey]);

  if (!apiKey) {
    throw new Error('BranchIO: apiKey is required')
  }

  return {
    branchData,
    branchLogout,
    closeJourney,
    openJourney,
    logEvent,
    branchStatus,
    setBranchIdentity,
    getBranchIdentity,
    hasIdentity,
    generateDeeplink,
    deepLink
  }
}


export { BranchProvider as useBranch };
