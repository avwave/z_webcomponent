import { LinkedProfile } from "./LinkedProfile";
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
  title: "Chat/LinkedProfile",
  component: LinkedProfile,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
};

export const Default = (args) => {
  const [chatProfileStatus, setChatProfileStatus] = useRecoilState(
    chatProfileStatusAtom
  );

  useEffect(() => {
    const fetchData = async () => {
      setChatProfileStatus(args.status);
    };

    fetchData().catch(console.error);
  }, []);

  const handleOpenStatusDialog = (
    open,
    setOpen,
    setStatus,
    setSubStatus,
    setCommentValue
  ) => {
    console.log("open", open);
    console.log("setopen", setOpen);
    setStatus(chatProfileStatus.status);
    setSubStatus(chatProfileStatus.sub_status);
    setCommentValue(chatProfileStatus.status_reason);

    setOpen(!open);

  };

  const handleCloseStatusDialog = (open, setOpen) => {
    console.log("open", open);
    console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleAcceptStatusDialog = (
    open,
    setOpen,
    status,
    subStatus,
    commentValue
  ) => {
    console.log("open", open);
    console.log("setopen", setOpen);
    setOpen(!open);

    console.log("status", status);
    console.log("subStatus", subStatus);
    console.log("commentValue", commentValue);
  };

  return (
    <LinkedProfile
      handleOpenStatusDialog={handleOpenStatusDialog}
      handleCloseStatusDialog={handleCloseStatusDialog}
      handleAcceptStatusDialog={handleAcceptStatusDialog}
      chatProfileStatus={chatProfileStatus}
      clinicAffiliation={args.clinicAffiliation}
      conversationInfo={args.conversationInfo}
      {...args}
    />
  );
};

Default.args = {
  profileName: "Patricia Ann Trinidad",
  profileLink: "#",
  profileLinkText: "View the profile",
  displayStatus: true,
  displayClinic: true,
  clinicAffiliation: [
    {
      id: 46,
      clinic: {
        id: 1,
        name: "ARC",
        label: "Allegiant Regional Care (ARC) Hospitals",
      },
      client: {
        id: 1309,
        first_name: "yustar",
        last_name: "pramudana",
        display_name: "yustar pramudana",
        type: "client",
        sub_type: null,
      },
    },
  ],
  status: {
    id: 204,
    type: "provider",
    sub_type: "MASSAGE_THERAPIST",
    status: "active",
    sub_status: null,
    status_reason: "this is comment value",
    old_status: "suspended",
    old_sub_status: "training",
    status_updated_by: {
      id: 438,
      first_name: "jan pasco",
      last_name: "ops",
      display_name: "jan pasco ops",
      type: "staff",
      sub_type: "CORPORATE",
    },
    status_last_updated: "2022-10-25T08:08:59Z",
    status_duration: 130543467,
    status_label: "Active",
  },
  conversationInfo: {
    "id": 2205,
    "source": { "id": 13 },
    "user": {
      "id": 443,
      "first_name": "Shane Olivierrrr",
      "last_name": "Jaducana",
      "avatar_url": "https://dnjqko642wsuu.cloudfront.net/images/k3s7bF0UeYtRILi3mDnM.png"
    },
    "linked_user": {
      "id": 203,
      "first_name": "Shaneeee Olivierrrr",
      "last_name": "Jaducana",
      "type": "provider",
      "sub_type": "MASSAGE_THERAPIST",
      "status": "blocked",
      "sub_status": "pending_deactivation",
      "profile_picture_url": "https://dnjqko642wsuu.cloudfront.net/images/k3s7bF0UeYtRILi3mDnM.png",
      "mobile_number": "+639173089080",
      "external_affiliation": { "id": 1, "name": "NONE", "label": "None" }
    },
    "assignee": null,
    "source_variant": {
      "can_reply": true,
      "device_platform": null,
      "device_id": null,
      "notification_id": null,
      "user_id": 203,
      "last_user_read_date": "2020-11-04T05:02:04Z",
      "user_truncate_message_date": null
    },
    "status": "INBOX",
    "channel": "PARTNER_SUPPORT",
    "transfer_info": {
      "destination_conversations": [
        { "id": 2313, "source": { "id": 15 }, "channel": "MEDICAL_SUPPORT" }
      ],
      "is_transfer_allowed": true,
      "minimum_timestamp": "2020-01-10T11:40:36.316Z"
    }
  }
  
};
