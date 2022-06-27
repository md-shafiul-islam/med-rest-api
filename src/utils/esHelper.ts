import { isNaN, isNumber } from "lodash";

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
 export const esIsEmpty = (value: string | number | object): boolean => {
    if (value === null) {
      return true;
    } else if (typeof value !== 'number' && value === '') {
      return true;
    } else if (typeof value === 'undefined' || value === undefined) {
      return true;
    } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
      return true;
    } else {
      return false;
    }
  };

  export const helperIsNumber = (numStr:any)=>{

    if(!esIsEmpty(numStr)){
      if(isNumber(numStr)){
        if(!isNaN(numStr)){
          return true;
        }
      }
    }
    return false;
  }