import React from "react";
import Calendar from "../../components/appointments/Calendar";

export const Aside = ({ onDateSelect, selectedDate }) => {
  return (
    <aside>
      <Calendar onDateSelect={onDateSelect} selectedDate={selectedDate} />
    </aside>
  );
};
