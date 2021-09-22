import { isEmpty } from "lodash";

export const isDeeplyEmpty = item => {
  if(typeof item === 'boolean') return false;
  else if(typeof item === 'number') return false;
  else if(typeof item === 'object') {
    return Object.keys(item).every(k => {
      if(['object', 'boolean', 'number'].includes(typeof item[k])) {
        if (item[k] === null || item[k] === undefined) return true;
        return isDeeplyEmpty(item[k]);
      }
      return isEmpty(item[k]);
    })
  }
  return !item;
};