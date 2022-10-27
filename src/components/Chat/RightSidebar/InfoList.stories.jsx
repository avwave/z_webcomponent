import React, { useState, useReducer } from "react";
import { Story, Meta } from "@storybook/react";
import {
  InfoList,
  InfoListItem,
  InputDialog,
  TextInputField,
  NumberInputField,
  RadioInputGroup,
} from ".";
import { argsTableLoadingData } from "@storybook/components";

export default {
  title: "Chat/InfoList",
  component: InfoList,
};

const initialInfos = [
  {
    key: "applyType",
    value: "",
    open: false,
  },
  {
    key: "canEnglish",
    value: "",
    open: false,
  },
  {
    key: "gender",
    value: "",
    open: false,
  },
  {
    key: "canCommute",
    value: "",
    open: false,
  },
  {
    key: "cityOfOrigin",
    value: "",
    open: false,
  },
  {
    key: "age",
    value: "",
    open: false,
  },
  {
    key: "askedRecentJob",
    value: "",
    open: false,
  },
  {
    key: "askedSalary",
    value: "",
    open: false,
  },
  {
    key: "mtCredentials",
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

  const [infos, dispatch] = useReducer(infoReducer, initialInfos);

  const handleOpen = (info) => {
    dispatch({ type: "OPEN", key: info.key });
  };

  const handleOnChange = (e, info) => {
    dispatch({ type: "VALUE", key: info.key, value: e.target.value });
  };

  return (
    <InfoList>
      {/* applyType  - SELECT */}
      <InfoListItem
        inputDialog={
          <InputDialog
            title="Title"
            open={infos[0].open}
            handleAccept={() => handleOpen(infos[0])}
            handleClose={() => handleOpen(infos[0])}
            handleClickOpen={() => handleOpen(infos[0])}
            dialogContent={
              <RadioInputGroup
                options={listData[0].selection}
                title="Title"
                value={infos[0].value}
                onChange={(e) => handleOnChange(e, infos[0])}
              />
            }
          />
        }
        label={listData[0].label}
        value={listData[0].display_value}
      />

      {/* canEnglish  BOOLEAN */}
      <InfoListItem
        inputDialog={
          <InputDialog
            title="Title"
            open={infos[1].open}
            handleAccept={() => handleOpen(infos[1])}
            handleClose={() => handleOpen(infos[1])}
            handleClickOpen={() => handleOpen(infos[1])}
            dialogContent={
              <RadioInputGroup
                options={boolValues}
                title="Title"
                value={infos[1].value}
                onChange={(e) => handleOnChange(e, infos[1])}
              />
            }
          />
        }
        label={listData[1].label}
        value={listData[1].display_value}
      />

      {/* gender - SELECT */}
      <InfoListItem
        inputDialog={
          <InputDialog
            title="Title"
            open={infos[2].open}
            handleAccept={() => handleOpen(infos[2])}
            handleClose={() => handleOpen(infos[2])}
            handleClickOpen={() => handleOpen(infos[2])}
            dialogContent={
              <RadioInputGroup
                options={listData[2].selection}
                title="Title"
                value={infos[2].value}
                onChange={(e) => handleOnChange(e, infos[2])}
              />
            }
          />
        }
        label={listData[2].label}
        value={listData[2].display_value}
      />

      {/* canCommute - BOOLEAN */}
      <InfoListItem
        inputDialog={
          <InputDialog
            title="Title"
            open={infos[3].open}
            handleAccept={() => handleOpen(infos[3])}
            handleClose={() => handleOpen(infos[3])}
            handleClickOpen={() => handleOpen(infos[3])}
            dialogContent={
              <RadioInputGroup
                options={boolValues}
                title="Title"
                value={infos[3].value}
                onChange={(e) => handleOnChange(e, infos[3])}
              />
            }
          />
        }
        label={listData[3].label}
        value={listData[3].display_value}
      />

      {/* cityOfOrigin - STRING */}
      <InfoListItem
        inputDialog={
          <InputDialog
            title="Title"
            open={infos[4].open}
            handleAccept={() => handleOpen(infos[4])}
            handleClose={() => handleOpen(infos[4])}
            handleClickOpen={() => handleOpen(infos[4])}
            dialogContent={
              <TextInputField
                label="Label"
                value={infos[4].value}
                onChange={(e) => handleOnChange(e, infos[4])}
              />
            }
          />
        }
        label={listData[4].label}
        value={listData[4].display_value}
      />

      {/* age - INTEGER */}
      <InfoListItem
        inputDialog={
          <InputDialog
            title="Title"
            open={infos[5].open}
            handleAccept={() => handleOpen(infos[5])}
            handleClose={() => handleOpen(infos[5])}
            handleClickOpen={() => handleOpen(infos[5])}
            dialogContent={
              <NumberInputField
                label="Label"
                value={infos[5].value}
                onChange={(e) => handleOnChange(e, infos[5])}
              />
            }
          />
        }
        label={listData[5].label}
        value={listData[5].display_value}
      />

      {/* askedRecentJob - STRING */}
      <InfoListItem
        inputDialog={
          <InputDialog
            title="Title"
            open={infos[6].open}
            handleAccept={() => handleOpen(infos[6])}
            handleClose={() => handleOpen(infos[6])}
            handleClickOpen={() => handleOpen(infos[6])}
            dialogContent={
              <TextInputField
                label="Label"
                value={infos[6].value}
                onChange={(e) => handleOnChange(e, infos[6])}
              />
            }
          />
        }
        label={listData[6].label}
        value={listData[6].display_value}
      />

      {/* askedSalary - BOOLEAN */}
      <InfoListItem
        inputDialog={
          <InputDialog
            title="Title"
            open={infos[7].open}
            handleAccept={() => handleOpen(infos[7])}
            handleClose={() => handleOpen(infos[7])}
            handleClickOpen={() => handleOpen(infos[7])}
            dialogContent={
              <RadioInputGroup
                options={boolValues}
                title="Title"
                value={infos[7].value}
                onChange={(e) => handleOnChange(e, infos[7])}
              />
            }
          />
        }
        label={listData[7].label}
        value={listData[7].display_value}
      />

      {/* mtCredentials - SELECT */}
      <InfoListItem
        inputDialog={
          <InputDialog
            title="Title"
            open={infos[8].open}
            handleAccept={() => handleOpen(infos[8])}
            handleClose={() => handleOpen(infos[8])}
            handleClickOpen={() => handleOpen(infos[8])}
            dialogContent={
              <RadioInputGroup
                options={listData[8].selection}
                title="Title"
                value={infos[8].value}
                onChange={(e) => handleOnChange(e, infos[8])}
              />
            }
          />
        }
        label={listData[8].label}
        value={listData[8].display_value}
      />
    </InfoList>
  );
};

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
