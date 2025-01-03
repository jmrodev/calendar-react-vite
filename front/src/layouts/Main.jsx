import React from "react";
import DayView from "../components/appointments/DayView";
import '../styles/layouts/main.css';

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
