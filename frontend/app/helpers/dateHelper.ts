import { Range } from "react-date-range";

export const getHoursAndMinutes = (date: string | Date) => {
  const localDate = new Date(date);
  return localDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const getDateWithMonth = (date: any) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

export const getDateWithMonthShort = (date: any) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });

export const dayDiff = (startDate: string, endDate: string) => {
  const date1 = new Date(startDate);
  const date2 = new Date(endDate);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getCurrentTimeFrame = (dateRange: Range) => {
  return `From ${getDateWithMonth(dateRange.startDate)} to ${getDateWithMonth(
    dateRange.endDate
  )}`;
};
