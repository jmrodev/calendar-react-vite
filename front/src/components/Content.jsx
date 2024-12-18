import React, { useState } from "react";
import { Main } from "./Main";
import { Aside } from "./Aside";

const Content = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isWeekDayView, setIsWeekDayView] = useState(false);

  const handleDateSelect = (date, isWeekDay = false) => {
    setSelectedDate(date);
    setIsWeekDayView(isWeekDay);
  };

  return (
    <div className="content">
      <Aside onDateSelect={handleDateSelect} selectedDate={selectedDate} />
      <Main selectedDate={selectedDate} isWeekDayView={isWeekDayView} />
    </div>
  );
};

export default Content;
