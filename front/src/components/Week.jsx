import React, { useState, useEffect } from "react";
import TimeSlot from "./TimeSlot";
import { generateTimeSlots } from "../utils/timeSlotUtils";
import "./styles/week.css";
import { standardizeDate } from "../utils/dateUtils";

const Week = ({ selectedDate }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTimeSlots = async () => {
      try {
        const slots = await generateTimeSlots(selectedDate);
        setTimeSlots(slots);
      } catch (err) {
        setError(err.message);
      }
    };

    if (selectedDate) {
      loadTimeSlots();
    }
  }, [selectedDate]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!selectedDate) {
    return <h3>Debe seleccionar un día</h3>;
  }

  return (
    <div className="week-schedule">
      {true && <h2>Horarios disponibles para el dia {standardizeDate(selectedDate)}</h2>}
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
