import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface DatePickerLocalProps {
  getDateChangeValue: (arg0: any) => void;
  date?: any;
}

const CustomDatePicker = ({
  date,
  getDateChangeValue,
}: DatePickerLocalProps) => {
  const [value, setValue] = React.useState<dayjs.Dayjs | null>(date ?? dayjs());
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Date / Time"
        value={dayjs(value)}
        onChange={(newValue) => {
          setValue(newValue);
          getDateChangeValue(newValue?.format("YYYY-MM-DD"));
        }}
        maxDate={dayjs()}
        shouldDisableDate={(date) => {
          const day = date.day();
          return day === 0 || day === 6; // Disable Sundays and Saturdays
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
