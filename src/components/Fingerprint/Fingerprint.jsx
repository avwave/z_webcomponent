import { makeStyles } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const useStyles = makeStyles((theme) => {
  return {}
})

let fpPromise = null

const registerFingerprint = () => {
  fpPromise = FingerprintJS.load({
    monitoring: false,
  })
}

const useFingerprint = async () => {
  const fp = await fpPromise
  const fpData = await fp.get()
  return fpData?.visitorId
}

const Fingerprint = ({ onFingerprint = () => { } }) => {
  const classes = useStyles()

  const [fp, setFp] = useState();

  useEffect(() => {
    if (!fpPromise) throw new Error('FingerprintJS not loaded, add registerFingerprint() closest to root as possible (possibly index.js)')
    const fetchFP = async () => {
      const fp = await fpPromise
      const fpData = await fp.get()
      setFp(fpData);
      onFingerprint(fpData?.visitorId)
    }

    fetchFP()
  }, [onFingerprint]);

  return (
    <></>
  )
}

export { registerFingerprint, useFingerprint, Fingerprint }