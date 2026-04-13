import React from "react";
import { DayPicker as HijriDayPicker, enUS as enUSHijri } from "react-day-picker/hijri";
import { type DayPickerProps } from "react-day-picker";
import { sharedCalendarClassNames } from "./CalendarStyles";

export type HijriCalendarProps = DayPickerProps & {
  activeVariant?: "monthly" | "weekly" | "compact";
};

export const HijriCalendar: React.FC<HijriCalendarProps> = ({
  activeVariant = "monthly",
  ...props
}) => {
  return (
    <HijriDayPicker
      locale={enUSHijri as any}
      numerals="latn"
      dir="ltr"
      hideNavigation
      today={new Date()}
      className="w-full"
      classNames={sharedCalendarClassNames}
      {...props}
    />
  );
};
