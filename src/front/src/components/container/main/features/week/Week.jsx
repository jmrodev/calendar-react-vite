// Week.jsx
import React, { useState, useEffect } from 'react';
import TimeSlot from './TimeSlot';
import { generateTimeSlots } from './timeSlotUtils';
import './week.css';

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

    return (
        <div className="week-schedule">
            <h2>Horarios disponibles</h2>
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