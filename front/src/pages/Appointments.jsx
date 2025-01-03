import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { AppContent } from "../layouts/AppContent";
import "../styles/pages/appointments.css";
import Calendar from "../components/appointments/Calendar";
import DayView from "../components/appointments/DayView";

const Appointments = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    console.log('Appointments - Nueva fecha seleccionada:', date);
    if (date === selectedDate) return;
    
    setSelectedDate(date);
  };

  return (
    <div className="page-container">
      <h1>Gestión de Citas</h1>
      <AppContent>
        <Calendar 
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />
        {selectedDate && <DayView selectedDate={selectedDate} />}
      </AppContent>
    </div>
  );
};

export default Appointments;
