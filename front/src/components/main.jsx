import React from "react";
import Week from "./Week";

export const Main = ({ selectedDate }) => {
  return (
    <main>
      <Week selectedDate={selectedDate} />
    </main>
  );
};
