/** @format */
const moment = require("moment");

const decodeB64 = (b64) => {
  const buf = Buffer.from(b64, "base64").toString("ascii");
  return buf;
};
const isNumeric = (str) => {
  if (typeof str != "string") return false; // we only process strings!
  return !isNaN(str) && !isNaN(parseInt(str));
};

const isDate = (str) => {
  return !isNaN(Date.parse(str));
};

const extractKey = (key) => {
  const splitter = "--";
  const data = key.split(splitter);
  const noise = data[0];
  const extractProp = {
    date: null,
    historyLength: null,
    origin: null,
  };
  if (noise && noise.length) {
    const processDataArr = data.filter((kStr) => !kStr.startsWith(noise));
    processDataArr.forEach((dataStr) => {
      if (isNumeric(dataStr)) extractProp.historyLength = parseInt(dataStr);
      else if (isDate(dataStr)) extractProp.date = dataStr;
      else if (dataStr.startsWith("http")) extractProp.origin = dataStr;
    });
  }
  return extractProp;
};

const validateData = (originData, submitData) => {
  let isValid = true;

  // Check if submitData date is after < 10min than originData
  const oriMm = moment(originData.date);
  const sbMm = moment(submitData.date);
  isValid = isValid && oriMm.isAfter(sbMm) && oriMm.diff(sbMm) <= 10;

  // Check if submitData date is after < 10min than originData
  isValid = isValid && originData.origin === submitData.origin;

  // Check if submitData is open from gg or not
  // const hisDiff = submitData.historyLength - originData.historyLength;
  const hisDiff = submitData.historyLength;
  isValid = isValid && 3 < hisDiff && hisDiff < 8;

  return isValid;
};

const validator = (originalData, key) => {
  try {
    const b64Key = key;
    const encryptKey = decodeB64(b64Key);
    const rawData = extractKey(encryptKey);
    return validateData(originalData, rawData);
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = validator;
