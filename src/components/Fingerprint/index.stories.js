import { Typography } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import {
  Fingerprint,
  registerFingerprint,
  useFingerprint,
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
