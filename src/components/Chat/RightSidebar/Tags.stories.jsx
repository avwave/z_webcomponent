import {
  Typography,
  Backdrop,
  CircularProgress,
  LinearProgress,
  Toolbar,
  Tooltip,
  withStyles,
  makeStyles,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Box,
  DialogTitle,
  Dialog,
  Button,
  InputLabel,
  FormControl,
  DialogContent,
  DialogActions,
  TextField,
  ListItem,
  ListItemText,
  List,
  ListItemIcon,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  CardMedia,
  CardActions,
  Collapse,
  Paper,
  Switch,
} from "@material-ui/core";
import { Tags, TagsDialogContent } from "./Tags";
import { fuzzyDate, personNameShort } from "../../utils/format";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import { InputDialog } from "./InputDialog";
import clsx from "clsx";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useState, useEffect, useReducer } from "react";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilRoot,
} from "recoil";
import { tagListAtom } from "../recoilStates";

export default {
  title: "Chat/Tags",
  component: Tags,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
};

const initialTags = [
  {
    tag: "NZ",
    label: "Not Zennya",
    description: "Is not presentable",
    checked: false,
  },
  {
    tag: "ENG",
    label: "English",
    description: "Cannot communicate in English",
    checked: false,
  },
  {
    tag: "CS",
    label: "Communication Skills",
    description: "Unable to convey their thoughts clearly",
    checked: false,
  },
  {
    tag: "GENDER",
    label: "Gender",
    description: "Gender is not needed in recruitment (Not female)",
    checked: false,
  },
  { tag: "AGE", label: "Age", description: "Age is not 19-40", checked: false },
  {
    tag: "HWR",
    label: "Height/Weight Ratio",
    description: "Candidate is not fit",
    checked: false,
  },
  {
    tag: "LTF",
    label: "Lives Too Far",
    description: "Living/residing too far from served cities",
    checked: false,
  },
  {
    tag: "LOOKYLOO",
    label: "Looky-Loo",
    description: "Not responsive",
    checked: false,
  },
  {
    tag: "EDUCATION",
    label: "Education",
    description: "Not a highschool graduate.",
    checked: false,
  },
  {
    tag: "CUSTOMER",
    label: "Customer",
    description: "Candidate is a customer and is not interested",
    checked: false,
  },
  {
    tag: "TRAINING",
    label: "Won't/Can't Train",
    description: "Candidate does not have the time to train.",
    checked: false,
  },
  {
    tag: "NO_MONEY",
    label: "Can't Afford",
    description: "Can't Afford to go office for interview/training",
    checked: false,
  },
  {
    tag: "PART_TIME",
    label: "Part time",
    description: "Can't work the minimum hours to train",
    checked: false,
  },
  {
    tag: "SPAM",
    label: "Spam",
    description: "Is sending spam or irrelevant messages",
    checked: false,
  },
  {
    tag: "NURSE_LICENSE",
    label: "Nurse License",
    description: "Nurse License was not given",
    checked: false,
  },
  {
    tag: "COVID_19_VAX_COMPLETE",
    label: "Covid19 Vax",
    description: "Incomplete Covid-19 vaccination, unwilling",
    checked: false,
  },
];

const tagsReducer = (state, action) => {
  switch (action.type) {
    case "CHECKED":
      return state.map((item) => {
        if (item.tag === action.tag) {
          return { ...item, checked: !action.checked };
        } else {
          return item;
        }
      });
    case "VALUE":
      return state.map((item) => {
        if (item.tag === action.tag) {
          return { ...item, value: action.value };
        } else {
          return item;
        }
      });
    default:
      console.log("oops switch defaulted", state);
      return state;
  }
};


export const Default = (args) => {
  const [tagList, setTagList] = useRecoilState(tagListAtom);
  const [tags, dispatch] = useReducer(tagsReducer, initialTags);

  useEffect(() => {
    const fetchData = async () => {
      setTagList(args.tagList);
   
      args.tagList.map((tag) => {
        dispatch({ type: "CHECKED", tag: tag.tag, checked: tag.deleted })

      })

    };

    fetchData().catch(console.error);
  }, []);

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

  const handleToggle = (e, tag) => {
    console.log("tag", tag);
    dispatch({ type: "CHECKED", tag: tag.tag, checked: tag.checked });

    if (tag.checked === false) {
      console.log(`adding the tag ${tag.tag}`);
      // call at http://dev.api.zennya.com/api/1/chat/conversations/${CONVERSATION_ID}/tags/add
      // Request Method: POST
      // payload: {"tag": ${TAG.TAG}}
    } else if (tag.checked === true) {
      console.log(`deleting the tag ${tag.tag}`);
      //Request URL: http://dev.api.zennya.com/api/1/chat/conversations/${CONVERSATION_ID}/tags/remove
      //Request Method: POST
      // {"tag":"${TAG.TAG}"}
    }
  };

  return (
    <Tags
      handleOpenAdd={handleOpenAdd}
      handleAddOnChange={handleAddOnChange}
      tagList={tagList}
      title={args.title}
      tags={tags}

    >
      <TagsDialogContent
        tagList={tagList}
        tags={tags}
        handleToggle={handleToggle}
      />
    </Tags>
  );
};

Default.args = {
  title: "Tags",
  tagList: [
    { tag: "AGE", date_updated: "2022-11-09T15:26:07Z", deleted: false },
    { tag: "GENDER", date_updated: "2022-11-09T15:20:26Z", deleted: true },
    { tag: "LTF", date_updated: "2022-11-09T15:20:26Z", deleted: false },
    { tag: "HWR", date_updated: "2022-11-09T15:20:26Z", deleted: false },
    { tag: "PART_TIME", date_updated: "2022-11-09T15:20:26Z", deleted: true },
    { tag: "SPAM", date_updated: "2022-11-09T15:20:26Z", deleted: false },
  ],
};
