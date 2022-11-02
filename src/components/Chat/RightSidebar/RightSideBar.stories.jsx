import React, { useState, useReducer, useEffect } from "react";
import { Story, Meta } from "@storybook/react";
import {
  InfoList,
  RightSidebar,
  InfoListItem,
  InputDialog,
  TextInputField,
  NumberInputField,
  RadioInputGroup,
  Notes,
  LinkedProfile,
  Schedules,
} from "./";
import { argsTableLoadingData } from "@storybook/components";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilRoot,
} from "recoil";
import { noteListAtom, infoListAtom} from "../recoilStates";

export default {
  title: "Chat/RightSidebar",
  component: RightSidebar,
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


export const Default = (args) => {
  const [noteList, setNoteList] = useRecoilState(noteListAtom);
  const [infoList, setInfoList] = useRecoilState(infoListAtom);


  useEffect(() => {
    const fetchData = async () => {
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      // await sleep(1000);
      setInfoList(listData);
      console.log(infoList)
    };

    fetchData().catch(console.error);
    console.log(infoList)
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      // await sleep(1000);
      setNoteList(args.notesArgs.noteList);
    };

    fetchData().catch(console.error);
  }, []);

  const handleOpenEdit = (note, open, setOpen) => {
    console.log("note", note);
    console.log("open", open);
    console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleAcceptEdit = (note, open, setOpen) => {
    console.log("note", note);
    console.log("open", open);
    console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleOpenDelete = (note, open, setOpen) => {
    console.log("note", note);
    console.log("open", open);
    console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleAcceptDelete = (note, open, setOpen) => {
    console.log("note", note);
    console.log("open", open);
    console.log("setopen", setOpen);
    setNoteList((prevState) =>
      prevState.filter((notes) => notes.id !== note.id)
    );
    setOpen(!open);
  };

  const handleEditOnChange = (e, value, setValue) => {
    console.log("e", e);
    console.log("value", value);
    console.log("setvalue", setValue);
    setValue(e.target.value);
  };

  const handleAddOnChange = (e, value, setValue) => {
    console.log("e", e);
    console.log("value", value);
    console.log("setvalue", setValue);
    setValue(e.target.value);
  };

  const handleOpenAdd = (open, setOpen) => {
    console.log("open", open);
    console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleAcceptAdd = (open, setOpen) => {
    console.log("open", open);
    console.log("setopen", setOpen);
    setOpen(!open);
  };


  const [infos, dispatch] = useReducer(infoReducer, initialInfos);

  const handleOpen = (info) => {
    dispatch({ type: "OPEN", key: info.key });
  };

  const handleOnChange = (e, info) => {
    dispatch({ type: "VALUE", key: info.key, value: e.target.value });
  };

  return (
    <RightSidebar
      profileSection={<LinkedProfile {...args.linkedProfileArgs} />}
    >
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
                  options={infoList[0]?.selection}
                  title="Title"
                  value={infos[0].value}
                  onChange={(e) => handleOnChange(e, infos[0])}
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
          label={infoList[1]?.label}
          value={infoList[1]?.display_value}
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
                  options={infoList[2]?.selection}
                  title="Title"
                  value={infos[2].value}
                  onChange={(e) => handleOnChange(e, infos[2])}
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
          label={infoList[3]?.label}
          value={infoList[3]?.display_value}
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
          label={infoList[4]?.label}
          value={infoList[4]?.display_value}
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
          label={infoList[5]?.label}
          value={infoList[5]?.display_value}
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
          label={infoList[6]?.label}
          value={infoList[6]?.display_value}
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
          label={infoList[7]?.label}
          value={infoList[7]?.display_value}
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
                  options={infoList[8]?.selection}
                  title="Title"
                  value={infos[8].value}
                  onChange={(e) => handleOnChange(e, infos[8])}
                />
              }
            />
          }
          label={infoList[8]?.label}
          value={infoList[8]?.display_value}
        />
      </InfoList>

      <Notes
      handleOpenAdd={handleOpenAdd}
      handleOpenEdit={handleOpenEdit}
      handleOpenDelete={handleOpenDelete}
      handleAcceptAdd={handleAcceptAdd}
      handleAcceptEdit={handleAcceptEdit}
      handleAcceptDelete={handleAcceptDelete}
      handleEditOnChange={handleEditOnChange}
      handleAddOnChange={handleAddOnChange}
      noteList={noteList}
      title={args.notesArgs.title}
      />
      <Schedules {...args.schedulesArgs} />
    </RightSidebar>
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

Default.args = {
  linkedProfileArgs: {
    profileName: "Patricia Ann Trinidad",
    profileLink: "#",
    profileLinkText: "View the profile",
    status_label: "Recruiting - Scheduling Interview",
  },
  notesArgs: {
    title: "Notes",
    noteList: [
      {
        id: 35,
        owner: {
          id: 854,
          first_name: "Denzel",
          last_name: "Deogracias",
          type: "staff",
        },
        conversation: {
          id: 2281,
          source: { id: 1 },
          channel: "RECRUITMENT",
        },
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu",
        date_created: "2019-12-05T03:41:39Z",
        last_updated: "2019-12-05T03:41:39Z",
      },
      {
        id: 36,
        owner: {
          id: 854,
          first_name: "Denzel",
          last_name: "Deogracias",
          type: "staff",
        },
        conversation: {
          id: 2281,
          source: { id: 1 },
          channel: "RECRUITMENT",
        },
        content: "Comment",
        date_created: "2019-12-05T06:34:21Z",
        last_updated: "2019-12-05T06:34:21Z",
      },
      {
        id: 37,
        owner: {
          id: 854,
          first_name: "Denzel",
          last_name: "Deogracias",
          type: "staff",
        },
        conversation: {
          id: 2281,
          source: { id: 1 },
          channel: "RECRUITMENT",
        },
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        date_created: "2019-12-05T06:43:10Z",
        last_updated: "2019-12-05T06:43:10Z",
      },
      {
        id: 40,
        owner: {
          id: 854,
          first_name: "Denzel",
          last_name: "Deogracias",
          type: "staff",
        },
        conversation: {
          id: 2281,
          source: { id: 1 },
          channel: "RECRUITMENT",
        },
        content: "gwa",
        date_created: "2019-12-05T07:03:41Z",
        last_updated: "2019-12-06T03:32:19Z",
      },
      {
        id: 41,
        owner: {
          id: 854,
          first_name: "Denzel",
          last_name: "Deogracias",
          type: "staff",
        },
        conversation: {
          id: 2281,
          source: { id: 1 },
          channel: "RECRUITMENT",
        },
        content: "pvc",
        date_created: "2019-12-05T07:24:22Z",
        last_updated: "2019-12-05T07:40:17Z",
      },
    ],
  },
  schedulesArgs: {
    title: "Schedules",
    preferedSchedule: "There are no prefered schedules.",
    matchedSchedule: " There are no matched schedules.",
  },
};
