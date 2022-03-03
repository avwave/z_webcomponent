import { Typography } from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  resetFingerprint,
  Fingerprint,
  registerFingerprint,
  useFingerprint,
  useFingerprintGuid,
} from "./Fingerprint";

const FingerprintStory = {
  component: Fingerprint,
  title: "Fingerprint",
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: [
          "primary",
          "secondary",
          "error",
          "warning",
          "info",
          "success",
        ],
      },
    },
  },
};

export default FingerprintStory;

registerFingerprint();

const AsComponentStory = ({ ...args }) => {
  const [fingerprint, setFingerprint] = useState("");
  return (
    <>
      <Fingerprint {...args} onFingerprint={(fp) => setFingerprint(fp)} />
      <Typography>{fingerprint}</Typography>
    </>
  );
};

export const AsComponent = AsComponentStory.bind({});
AsComponent.args = {};


const AsComponentGuidStory = ({ ...args }) => {
  const [fingerprint, setFingerprint] = useState("");
  return (
    <>
      <Fingerprint {...args} guid onFingerprint={(fp) => setFingerprint(fp)} />
      <Typography>GUID: {fingerprint}</Typography>
      <button onClick={async()=>{
        await resetFingerprint()
      }}>Reset Fingerprint</button>
    </>
  );
};

export const AsComponentGuid = AsComponentGuidStory.bind({});
AsComponentGuid.args = {};

const AsComponentFunctionStory = ({ ...args }) => {
  const [fingerprint, setFingerprint] = useState();
  useEffect(() => {
    const Getfp = async () => {
      setFingerprint(await useFingerprint());
    }
    Getfp()
  }, []);
  return (
    <>
      <Typography>{fingerprint}</Typography>
    </>
  );
};

export const AsComponentFunction = AsComponentFunctionStory.bind({});
AsComponentFunction.args = {};

const AsComponentFunctionGuidStory = ({ ...args }) => {
  const [fingerprint, setFingerprint] = useState();
  useEffect(() => {
    const Getfp = async () => {
      setFingerprint(await useFingerprintGuid());
    }
    Getfp()
  }, []);
  return (
    <>
      <Typography>GUID: {fingerprint}</Typography>
      <button onClick={async()=>{
        await resetFingerprint()

      }}>Reset Fingerprint</button>
    </>
  );
};

export const AsComponentFunctionGuid = AsComponentFunctionGuidStory.bind({});
AsComponentFunctionGuid.args = {};
