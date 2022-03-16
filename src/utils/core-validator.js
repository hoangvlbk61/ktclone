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
      if (isNumeric(dataStr) && parseInt(dataStr) < 999)
        extractProp.historyLength = parseInt(dataStr);
      else if (dataStr.startsWith("http")) extractProp.origin = dataStr;
      else {
        try {
          if (isNumeric(dataStr) && parseInt(dataStr) > 999999)
            extractProp.date = parseInt(dataStr);
        } catch (error) {
          console.log("Error in moment check data", error);
        }
      }
    });
  }
  return extractProp;
};

const validateData = (originData, submitData, step) => {
  console.log(
    "🚀 ~ file: core-validator.js ~ line 38 ~ validateData ~ submitData",
    submitData
  );
  console.log(
    "🚀 ~ file: core-validator.js ~ line 38 ~ validateData ~ originData",
    originData
  );
  let isValid = true;

  // Check if submitData date is after < 10min than originData
  const oriMm = moment(originData.date);
  const sbMm = moment(new Date(submitData.date));
  isValid =
    isValid &&
    oriMm.isAfter(sbMm) &&
    moment.duration(oriMm.diff(sbMm)).asMinutes() <= 10;

  // Check if submitData date is after < 10min than originData
  const rawUrl = new URL(originData.origin);
  isValid =
    isValid &&
    rawUrl.origin.replace("www.", "") === submitData.origin.replace("www.", "");
  // Check if submitData is open from gg or not
  // const hisDiff = submitData.historyLength - originData.historyLength;
  const hisDiff = submitData.historyLength;
  isValid = isValid && step <= hisDiff && hisDiff < 8;

  return isValid;
};

const validator = (originalData, key, step) => {
  try {
    const b64Key = key;
    const encryptKey = decodeB64(b64Key);
    const rawData = extractKey(encryptKey);
    return validateData(originalData, rawData, step);
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = validator;
