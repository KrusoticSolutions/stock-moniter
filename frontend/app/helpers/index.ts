import checkTouched from "./checkTouchedHelper";
import checkValidation from "./checkValidationHelper";
import { getDateWithMonth, getHoursAndMinutes, dayDiff } from "./dateHelper";
import formatBytes from "./formatBytes";
import getRandomColor from "./getRandomColor";
import getRandomNumber from "./getRandomNumber";
import inputHelper from "./inputHelper";
import unAuthorizedHelper from "./unAutorizedHelper";

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const firstCapital = (string: string) => {
  let hasDash = false;
  if (string?.includes("_")) {
    hasDash = true;
  }

  const str = hasDash
    ? string.split("_").join(" ").toLowerCase()
    : string.toLowerCase();

  const returnedString = str.charAt(0).toUpperCase() + str.slice(1);

  return returnedString;
};

const extractLinks = (text: string) => {
  const regex = /^(https):\/\/[^ "]+\.[^ "]+$/;
  return text.match(regex);
};

export {
  dayDiff,
  a11yProps,
  inputHelper,
  getHoursAndMinutes,
  getDateWithMonth,
  getRandomColor,
  checkValidation,
  checkTouched,
  unAuthorizedHelper,
  formatBytes,
  firstCapital,
  extractLinks,
  getRandomNumber,
};
