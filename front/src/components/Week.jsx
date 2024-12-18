import React, { useState, useEffect } from "react";
import TimeSlot from "./TimeSlot";
import { generateTimeSlots } from "../utils/timeSlotUtils";
import { getAppointmentsByWeekDay } from "../services/appointmentsService";
import "./styles/week.css";
import { standardizeDate } from "../utils/dateUtils";

const Week = ({ selectedDate, isWeekDayView }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTimeSlots = async () => {
      try {
        if (isWeekDayView) {
          const dayOfWeek = selectedDate.getDay();
          const slots = await getAppointmentsByWeekDay(dayOfWeek);
          const slotsWithDate = slots.map(slot => ({
            ...slot,
            date: selectedDate.toISOString().split('T')[0]
          }));
          setTimeSlots(slotsWithDate);
        } else {
          const slots = await generateTimeSlots(selectedDate);
          setTimeSlots(slots);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (selectedDate) {
      loadTimeSlots();
    }
  }, [selectedDate, isWeekDayView]);

  if (error) return <div className="error">{error}</div>;
  if (!selectedDate) return <h3>Debe seleccionar un día</h3>;

  const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayName = weekDays[selectedDate.getDay()];

  return (
    <div className="week-schedule">
      <h2>
        {isWeekDayView 
          ? `Horarios para ${dayName}` 
          : `Horarios para el ${standardizeDate(selectedDate)}`
        }
      </h2>
      <div className="time-slots">
        {timeSlots.map((slot) => (
          <TimeSlot
            key={slot._id}
            slot={slot}
            selectedDate={selectedDate}
            setTimeSlots={setTimeSlots}
            setError={setError}
          />
        ))}
      </div>
    </div>
  );
};

export default Week;
