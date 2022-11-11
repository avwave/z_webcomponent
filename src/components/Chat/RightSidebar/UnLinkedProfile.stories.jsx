import { UnLinkedProfile } from "./UnLinkedProfile";
import React, { useState, useEffect } from "react";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilRoot,
} from "recoil";
import { chatProfileStatusAtom } from "../recoilStates";

export default {
  title: "Chat/UnLinkedProfile",
  component: UnLinkedProfile,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
};

export const Default = (args) => {
  return <UnLinkedProfile {...args} />;
};

Default.args = {
 
};
