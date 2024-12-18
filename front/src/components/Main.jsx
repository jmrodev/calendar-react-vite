import React from "react";
import Week from "./Week";

export const Main = ({ selectedDate, isWeekDayView }) => {
  return (
    <main>
      <Week selectedDate={selectedDate} isWeekDayView={isWeekDayView} />
    </main>
  );
};
