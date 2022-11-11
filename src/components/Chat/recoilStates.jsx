import {
  atom,
  selector
} from "recoil";


export const conversationIdAtom = atom({
  key: "conversationId",
  default: "",
});


export const recipientUserIdAtom = atom({
  key: "recipientUserId",
  default: "",
});


export const noteListAtom = atom({
    key: "noteList",
    default: [],
  });

  
export const infoListAtom = atom({
  key: "infoList", 
  default: [],
});

  
export const tagListAtom = atom({
  key: "tagList", 
  default: [],
});

export const chatProfileStatusAtom = atom({
  key: "chatProfileStatus", 
  default: {},
})