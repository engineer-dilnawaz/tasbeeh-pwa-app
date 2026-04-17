import React from "react";
import { DayPicker as HijriDayPicker, enUS as enUSHijri } from "react-day-picker/hijri";
import { type DayPickerProps } from "react-day-picker";
import { sharedCalendarClassNames } from "./CalendarStyles";

export type HijriCalendarProps = DayPickerProps & {
  activeVariant?: "monthly" | "weekly" | "compact";
};

export const HijriCalendar: React.FC<HijriCalendarProps> = ({
  ...props
}) => {
  return (
    <HijriDayPicker
      locale={enUSHijri as unknown as NonNullable<React.ComponentProps<typeof HijriDayPicker>["locale"]>}
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
