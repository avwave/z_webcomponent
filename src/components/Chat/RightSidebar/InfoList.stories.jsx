import React, { useState, useReducer, useEffect } from "react";
import { Story, Meta } from "@storybook/react";
import {
  InfoList,
  InfoListItem,
  InputDialog,
  TextInputField,
  NumberInputField,
  RadioInputGroup,
} from ".";
import { infoListAtom } from "../recoilStates";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilRoot,
} from "recoil";

export default {
  title: "Chat/InfoList",
  component: InfoList,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
};
const initialInfos = [
  {
    key: "applyType",
    type: "select",
    value: "",
    open: false,
  },
  {
    key: "confirmEnglish",
    type: "boolean",
    value: "",
    open: false,
  },
  {
    key: "gender",
    type: "select",
    value: "",
    open: false,
  },
  {
    key: "canCommute",
    type: "boolean",
    value: "",
    open: false,
  },
  {
    key: "city",
    type: "string",
    value: "",
    open: false,
  },
  {
    key: "age",
    type: "integer",
    value: "",
    open: false,
  },
  {
    key: "askedRecentJob",
    type: "string",
    value: "",
    open: false,
  },
  {
    key: "askedSalary",
    type: "boolean",
    value: "",
    open: false,
  },
  {
    key: "experience",
    type: "select",
    value: "",
    open: false,
  },
];

export const List = () => {
  const infoReducer = (state, action) => {
    switch (action.type) {
      case "OPEN":
        return state.map((info) => {
          if (info.key === action.key) {
            return { ...info, open: !info.open };
          } else {
            return info;
          }
        });
      case "VALUE":
        return state.map((info) => {
          if (info.key === action.key) {
            return { ...info, value: action.value };
          } else {
            return info;
          }
        });
      default:
        console.log(state);
        return state;
    }
  };

  const [infoList, setInfoList] = useRecoilState(infoListAtom);

  useEffect(() => {
    const fetchData = async () => {
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      // await sleep(1000);
      setInfoList(listData);
    };

    fetchData().catch(console.error);
  }, []);

  const [infos, dispatch] = useReducer(infoReducer, initialInfos);

  const handleOpen = (info) => {
    dispatch({ type: "OPEN", key: info.key });
  };

  const handleOnChange = (e, info) => {
    dispatch({ type: "VALUE", key: info.key, value: e.target.value });
  };

  
  const handleAcceptInfo = async (info) => {
    try {
      console.log("handleAcceptInfo info", info);
      console.log("infotype", info.type);

      switch (info.type) {
        case "boolean": {
          const payload = {
            key: info.key,
            value: info.value === "true" ? true : false,
          };
          console.log("payload", payload);
          //    const response = await ChatService.updateUserInfo({
          //     cid: conversationId,
          //      payload: payload,
          //   });
          //    console.log('handleAcceptInfo response', response);
          break;
        }
        case "select": {
          const payload = { key: info.key, value: info.value };
          console.log("payload", payload);
          //    const response = await ChatService.updateUserInfo({
          //     cid: conversationId,
          //      payload: payload,
          //    });

          //   console.log('handleAcceptInfo response', response);
          break;
        }
        case "string": {
          const payload = { key: info.key, value: info.value };
          console.log("payload", payload);
          //    const response = await ChatService.updateUserInfo({ cid: conversationId, payload: payload });

          //   console.log('handleAcceptInfo response', response);
          break;
        }
        case "integer": {
          const stringifiedValue = JSON.stringify({
            amount: info.value,
            unit: "year",
          });
          const payload = { key: info.key, value: stringifiedValue };
          console.log("payload", payload);
          //     const response = await ChatService.updateUserInfo({ cid: conversationId, payload: payload });

          //   console.log('handleAcceptInfo response', response);
          break;
        }
        default: {
          console.error("Switch case acting weird");
        }
      }
    } catch (error) {
      console.error(error);
    }

    dispatch({ type: "OPEN", key: info.key });
  };



  return (
    <InfoList>
        {/* applyType  - SELECT */}
        <InfoListItem
          inputDialog={
            <InputDialog
              title="Edit Application Type"
              open={infos[0].open}
              handleAccept={() => handleAcceptInfo(infos[0])}
              handleClose={() => handleOpen(infos[0])}
              handleClickOpen={() => handleOpen(infos[0])}
              dialogContent={
                <RadioInputGroup
                  options={applyTypeOptions}
                  title="Application Type"
                  value={infos[0].value}
                  onChange={e => handleOnChange(e, infos[0])}
                />
              }
            />
          }
          label={infoList[0]?.label}
          value={infoList[0]?.display_value}
        />

        {/* canEnglish  BOOLEAN */}
        <InfoListItem
          inputDialog={
            <InputDialog
              title="Edit English"
              open={infos[1].open}
              handleAccept={() => handleAcceptInfo(infos[1])}
              handleClose={() => handleOpen(infos[1])}
              handleClickOpen={() => handleOpen(infos[1])}
              dialogContent={
                <RadioInputGroup
                  options={boolValues}
                  title="Can applicant speak English?"
                  value={infos[1].value}
                  onChange={e => handleOnChange(e, infos[1])}
                />
              }
            />
          }
          label={infoList[1]?.label}
          value={infoList[1]?.display_value}
        />

        {/* gender - SELECT */}
        <InfoListItem
          inputDialog={
            <InputDialog
              title="Edit Gender"
              open={infos[2].open}
              handleAccept={() => handleAcceptInfo(infos[2])}
              handleClose={() => handleOpen(infos[2])}
              handleClickOpen={() => handleOpen(infos[2])}
              dialogContent={
                <RadioInputGroup
                  options={infoList[2]?.selection}
                  title="Applicant's Gender"
                  value={infos[2].value}
                  onChange={e => handleOnChange(e, infos[2])}
                />
              }
            />
          }
          label={infoList[2]?.label}
          value={infoList[2]?.display_value}
        />

        {/* canCommute - BOOLEAN */}
        <InfoListItem
          inputDialog={
            <InputDialog
              title="Edit Commute to Manila"
              open={infos[3].open}
              handleAccept={() => handleAcceptInfo(infos[3])}
              handleClose={() => handleOpen(infos[3])}
              handleClickOpen={() => handleOpen(infos[3])}
              dialogContent={
                <RadioInputGroup
                  options={boolValues}
                  title="Can Applicant Commute to Manila?"
                  value={infos[3].value}
                  onChange={e => handleOnChange(e, infos[3])}
                />
              }
            />
          }
          label={infoList[3]?.label}
          value={infoList[3]?.display_value}
        />

        {/* cityOfOrigin - STRING */}
        <InfoListItem
          inputDialog={
            <InputDialog
              title="Edit City of Origin"
              open={infos[4].open}
              handleAccept={() => handleAcceptInfo(infos[4])}
              handleClose={() => handleOpen(infos[4])}
              handleClickOpen={() => handleOpen(infos[4])}
              dialogContent={
                <TextInputField
                  label="Applicant's City of Origin"
                  value={infos[4].value}
                  onChange={e => handleOnChange(e, infos[4])}
                />
              }
            />
          }
          label={infoList[4]?.label}
          value={infoList[4]?.display_value}
        />

        {/* age - INTEGER */}
        <InfoListItem
          inputDialog={
            <InputDialog
              title="Edit Age"
              open={infos[5].open}
              handleAccept={() => handleAcceptInfo(infos[5])}
              handleClose={() => handleOpen(infos[5])}
              handleClickOpen={() => handleOpen(infos[5])}
              dialogContent={
                <NumberInputField
                  label="Applicant's Age"
                  value={infos[5].value}
                  onChange={e => handleOnChange(e, infos[5])}
                />
              }
            />
          }
          label={infoList[5]?.label}
          value={infoList[5]?.display_value}
        />

        {/* askedRecentJob - STRING */}
        <InfoListItem
          inputDialog={
            <InputDialog
              title="Edit Recent job"
              open={infos[6].open}
              handleAccept={() => handleAcceptInfo(infos[6])}
              handleClose={() => handleOpen(infos[6])}
              handleClickOpen={() => handleOpen(infos[6])}
              dialogContent={
                <TextInputField
                label="Recent Job Applicant Held"
                value={infos[6].value}
                  onChange={e => handleOnChange(e, infos[6])}
                />
              }
            />
          }
          label={infoList[6]?.label}
          value={infoList[6]?.display_value}
        />

        {/* askedSalary - BOOLEAN */}
        <InfoListItem
          inputDialog={
            <InputDialog
              title="Edit Asked About Salary"
              open={infos[7].open}
              handleAccept={() => handleAcceptInfo(infos[7])}
              handleClose={() => handleOpen(infos[7])}
              handleClickOpen={() => handleOpen(infos[7])}
              dialogContent={
                <RadioInputGroup
                  options={boolValues}
                  title="Asked About Salary"
                  value={infos[7].value}
                  onChange={e => handleOnChange(e, infos[7])}
                />
              }
            />
          }
          label={infoList[7]?.label}
          value={infoList[7]?.display_value}
        />

        {/* mtCredentials - SELECT */}
        <InfoListItem
          inputDialog={
            <InputDialog
              title="Edit MT Credentials"
              open={infos[8].open}
              handleAccept={() => handleAcceptInfo(infos[8])}
              handleClose={() => handleOpen(infos[8])}
              handleClickOpen={() => handleOpen(infos[8])}
              dialogContent={
                <RadioInputGroup
                  options={infoList[8]?.selection}
                  title="Credentials"
                  value={infos[8].value}
                  onChange={e => handleOnChange(e, infos[8])}
                />
              }
            />
          }
          label={infoList[8]?.label}
          value={infoList[8]?.display_value}
        />
      </InfoList>
  );
};

const applyTypeOptions = [
  {
    value: 'Massage Therapist',
    displayValue: 'Massage Therapist',
  },
  {
    value: 'NURSE',
    displayValue: 'Nurse',
  },
];


const listData = [
  {
    type: "SELECT",
    key: "applyType",
    label: "Application Type",
    description: null,
    timestamp: 1572873065000,
    value: "NURSE",
    display_value: "Nurse",
    selection: [
      { value: "MASSAGE_THERAPIST", displayValue: "Massage Therapist" },
      { value: "HEALTH_WORKER", displayValue: "Health Worker" },
      { value: "PHYSICAL_THERAPIST", displayValue: "Physical Therapist" },
      { value: "NURSE", displayValue: "Nurse" },
      { value: "MED_TECH", displayValue: "Medical Technologist" },
      { value: "DOCTOR", displayValue: "Doctor" },
    ],
  },
  {
    type: "BOOLEAN",
    key: "canEnglish",
    label: "English",
    description: "Can communicate in English",
    timestamp: 1572873645000,
    value: true,
    display_value: "Yes",
  },
  {
    type: "SELECT",
    key: "gender",
    label: "Gender",
    description: null,
    timestamp: 1572873789000,
    value: "female",
    display_value: "Female",
    selection: [
      { value: "male", displayValue: "Male" },
      { value: "female", displayValue: "Female" },
    ],
  },
  {
    type: "BOOLEAN",
    key: "canCommute",
    label: "Commute to Manila",
    description: null,
    timestamp: 1572873801000,
    value: true,
    display_value: "Yes",
  },
  {
    type: "STRING",
    key: "cityOfOrigin",
    label: "City of Origin",
    description: null,
    timestamp: 1574671098000,
    value: "Valenzuelas",
    display_value: "Valenzuelas",
  },
  {
    type: "INTEGER",
    key: "age",
    label: "Age",
    description: null,
    timestamp: 1572873897000,
    value: 30,
    display_value: "30",
  },
  {
    type: "STRING",
    key: "askedRecentJob",
    label: "Recent job",
    description: null,
    timestamp: 1574672131000,
    value: "Painter",
    display_value: "Painter",
  },
  {
    type: "BOOLEAN",
    key: "askedSalary",
    label: "Asked About Salary",
    description: null,
    timestamp: 1572873900000,
    value: true,
    display_value: "Yes",
  },
  {
    type: "SELECT",
    key: "mtCredentials",
    label: "MT Credentials",
    description: "Massage Therapy credentials",
    timestamp: null,
    value: null,
    display_value: "Unknown",
    selection: [
      { value: "none", displayValue: "None" },
      { value: "has_experience", displayValue: "Has Experience" },
      { value: "is_licensed", displayValue: "Is Licensed" },
      { value: "NC2", displayValue: "Is Licensed - NC2" },
      { value: "DOH", displayValue: "Is Licensed - DOH" },
    ],
  },
];

const boolValues = [
  { value: "true", displayValue: "Yes" },
  { value: "false", displayValue: "No" },
];
