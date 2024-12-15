import React from "react";
import Calendar from "./calendar";

export const Aside = ({ onDateSelect, selectedDate }) => {
  return (
    <aside>
      <Calendar onDateSelect={onDateSelect} selectedDate={selectedDate} />
    </aside>
  );
};
