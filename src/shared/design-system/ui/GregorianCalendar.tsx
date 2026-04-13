import React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { sharedCalendarClassNames } from "./CalendarStyles";

export type GregorianCalendarProps = DayPickerProps & {
  activeVariant?: "monthly" | "weekly" | "compact";
};

export const GregorianCalendar: React.FC<GregorianCalendarProps> = ({
  activeVariant = "monthly",
  ...props
}) => {
  return (
    <DayPicker
      hideNavigation
      today={new Date()}
      className="w-full"
      classNames={sharedCalendarClassNames}
      {...props}
    />
  );
};
