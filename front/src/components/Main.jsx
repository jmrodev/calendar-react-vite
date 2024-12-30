import React from "react";
import Week from "./Week";
import './styles/main.css';

export const Main = ({ selectedDate, isWeekDayView }) => {
  return (
    <main className="main-content">
      <div className="container">
        <Week 
          selectedDate={selectedDate} 
          isWeekDayView={isWeekDayView} 
        />
      </div>
    </main>
  );
};
