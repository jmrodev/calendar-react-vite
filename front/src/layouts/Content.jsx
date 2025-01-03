import React, { useState, useEffect } from "react";
import { Main } from "../layouts/Main";
import { Aside } from "../components/common/Aside";
import '../styles/layouts/content.css';

export const Content = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem('selectedDate');
    return savedDate || null;
  });

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    localStorage.setItem('selectedDate', date);
  };

  return (
    <div className="content">
      <Aside onDateSelect={handleDateSelect} selectedDate={selectedDate} />
      <Main selectedDate={selectedDate} />
    </div>
  );
};

