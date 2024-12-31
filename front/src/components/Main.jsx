import React from "react";
import Week from "./Week";
import DayView from "./DayView";
import './styles/main.css';

export const Main = ({ selectedDate, isWeekDayView }) => {
  return (
    <main className="main-content">
      <div className="container">
        {selectedDate ? (
          <DayView selectedDate={selectedDate} />
        ) : (
          <div className="no-date-selected">
            Selecciona una fecha para ver las citas
          </div>
        )}
      </div>
    </main>
  );
};
