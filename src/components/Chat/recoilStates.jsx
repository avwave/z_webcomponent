import {
  atom,
  selector
} from "recoil";



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