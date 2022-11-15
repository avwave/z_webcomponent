import { Notes } from "./Notes";
import { fuzzyDate, personNameShort } from "../../utils/format";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import { InputDialog } from "./InputDialog";
import clsx from "clsx";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useState, useEffect } from "react";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilRoot,
} from "recoil";
import { rest } from "msw";
import { noteListAtom, conversationIdAtom } from "../recoilStates";
import { ChatService } from "../chatService";

const API_URL = process.env.REACT_APP_WEB_ADMIN_URL + "/";

export default {
  title: "Chat/Notes",
  component: Notes,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
};

// keeping the data handling with ChatService as example here, will probably be just displays in others

export const Default = (args) => {
  const [conversationId, setConversationId] = useState(2281);
  const [noteList, setNoteList] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setNoteList(args.dummyNoteList.list);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData().catch(console.error);
  }, [conversationId]);

  const handleOpenEdit = (note, open, setOpen) => {
    // console.log("note", note);
    // console.log("open", open);
    // console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleAcceptEdit = (note, open, setOpen) => {
    // console.log("note", note);
    // console.log("open", open);
    // console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleOpenDelete = (note, open, setOpen) => {
    // console.log("note", note);
    // console.log("open", open);
    // console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleAcceptDelete = (note, open, setOpen) => {
    // console.log("note", note);
    // console.log("open", open);
    // console.log("setopen", setOpen);
    setNoteList((prevState) =>
      prevState.filter((notes) => notes.id !== note.id)
    );
    setOpen(!open);
  };

  const handleEditOnChange = (e, value, setValue) => {
    // console.log("e", e);
    // console.log("value", value);
    // console.log("setvalue", setValue);
    setValue(e.target.value);
  };

  const handleAddOnChange = (e, value, setValue) => {
    // console.log("e", e);
    // console.log("value", value);
    // console.log("setvalue", setValue);
    setValue(e.target.value);
  };

  const handleOpenAdd = (open, setOpen) => {
    // console.log("open", open);
    // console.log("setopen", setOpen);
    setOpen(!open);
  };

  const handleAcceptAdd = (open, setOpen) => {
    // console.log("open", open);
    // console.log("setopen", setOpen);
    setOpen(!open);
  };

  return (
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
      title={args.title}
    />
  );
};

Default.parameters = {
  msw: {
    handlers: [
      rest.get(
        `${API_URL}api/1/chat/conversations/2281/notes`,
        (req, res, ctx) => {
          return res(ctx.json(Default.args.dummyNoteList));
        }
      ),
    ],
  },
};

Default.args = {
  title: "Notes",
  dummyNoteList: {
    list: [
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
};
