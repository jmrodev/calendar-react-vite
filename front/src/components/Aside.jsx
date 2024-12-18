import React from "react";
import Calendar from "./Calendar";

export const Aside = ({ onDateSelect, selectedDate }) => {
  return (
    <aside>
      <Calendar onDateSelect={onDateSelect} selectedDate={selectedDate} />
    </aside>
  );
};
