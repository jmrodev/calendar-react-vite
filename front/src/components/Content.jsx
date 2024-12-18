import React, { useState, useEffect } from "react";
import { Main } from "./Main";
import { Aside } from "./Aside";

const Content = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem('selectedDate');
    return savedDate ? new Date(savedDate) : null;
  });
  const [isWeekDayView, setIsWeekDayView] = useState(false);

  const handleDateSelect = (date, isWeekDay = false) => {
    setSelectedDate(date);
    setIsWeekDayView(isWeekDay);
    localStorage.setItem('selectedDate', date.toISOString());
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem('selectedDate');
    };
  }, []);

  return (
    <div className="content">
      <Aside onDateSelect={handleDateSelect} selectedDate={selectedDate} />
      <Main selectedDate={selectedDate} isWeekDayView={isWeekDayView} />
    </div>
  );
};

export default Content;
