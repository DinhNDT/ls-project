import { sha256 } from "js-sha256";
import { nanoid } from "nanoid";

function sortObjDataByKey(object) {
  const orderedObject = Object.keys(object)
    .sort()
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
  return orderedObject;
}

function convertObjToQueryStr(object) {
  return Object.keys(object)
    .filter((key) => object[key] !== undefined)
    .map((key) => {
      let value = object[key];
      // Sort nested object
      if (value && Array.isArray(value)) {
        value = JSON.stringify(value.map((val) => sortObjDataByKey(val)));
      }
      // Set empty string if null
      if ([null, undefined, "undefined", "null"].includes(value)) {
        value = "";
      }

      return `${key}=${value}`;
    })
    .join("&");
}

export function generateSignature(data, checksumKey) {
  const sortedDataByKey = sortObjDataByKey(data);
  const dataQueryStr = convertObjToQueryStr(sortedDataByKey);

  const dataToSignature = sha256.hmac
    .create(checksumKey)
    .update(dataQueryStr)
    .hex();

  return dataToSignature;
}

export const generateOrderIdRepayment = (orderCode) => {
  const suffix = "payment-again";
  const newOrderCode = orderCode + "-" + suffix + "-" + nanoid(10);
  return newOrderCode;
};
