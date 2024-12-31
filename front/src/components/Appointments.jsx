import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import  fetchAppointmentsByDate  from '../redux/slices/appointmentsSlice';
import { Aside } from "./Aside";
import { Main } from "./Main";
import { AppContent } from "./AppContent";
import { Header } from "./Header";
import { Footer } from "./Footer";
import "./styles/appointments.css";
import  Calendar  from "./Calendar";
import  DayView  from "./DayView";

const Appointments = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
   
    setSelectedDate(date);
    dispatch(fetchAppointmentsByDate(date));
  };

  return (
    <div className="page-container">
      <h1>Gestión de Citas</h1>
      <AppContent>
        <Calendar 
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />
        <DayView date={selectedDate} />
      </AppContent>
    </div>
  );
};

export default Appointments;
