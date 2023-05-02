import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs'

import { v4 as uuidv4 } from "uuid";
import isEmpty from 'lodash.isempty';

const useStyles = makeStyles()((theme) => {
  return {}
});

let fpPromise = null

const registerFingerprint = async () => {
  fpPromise = FingerprintJS.load({
    monitoring: false,
  })
  const fp = await localStorage.getItem('fingerprint')
  if (isEmpty(fp)) {
    await localStorage.setItem('fingerprint', uuidv4())
  }
}

const useFingerprint = async () => {
  const fp = await fpPromise
  const fpData = await fp.get()
  return fpData?.visitorId
}


const useFingerprintGuid = async () => {
  return await localStorage.getItem('fingerprint')
}

const resetFingerprint = async () => {
  await localStorage.setItem('fingerprint', uuidv4())
}

const Fingerprint = ({ guid=false, onFingerprint = () => { } }) => {
  const { classes } = useStyles()

  useEffect(() => {
    if (!fpPromise) throw new Error('FingerprintJS not loaded, add registerFingerprint() closest to root as possible (possibly index.js)')
    const fetchFP = async () => {
      const fp = await fpPromise
      const fpData = await fp.get()
      const guidFp = await localStorage.getItem('fingerprint')
      
      onFingerprint(guid ? guidFp : fpData?.visitorId)
    }

    fetchFP()
  }, [guid, onFingerprint]);

  return (
    <></>
  )
}

export { useFingerprintGuid, resetFingerprint, registerFingerprint, useFingerprint, Fingerprint }