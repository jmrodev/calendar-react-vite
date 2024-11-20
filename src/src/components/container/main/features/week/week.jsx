import React, { useState } from 'react';
import './week.css';

const Week = ({ selectedDate }) => {
    const [appointments, setAppointments] = useState({});

    // Generate time slots from 8 AM to 7 PM (19:00)
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour < 20; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            slots.push({
                time: timeString,
                available: true,
                appointment: null
            });
        }
        return slots;
    };

    const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

    const handleSlotClick = (slot) => {
        const newAppointments = { ...appointments };
        const key = slot.time;

        if (!newAppointments[key]) {
            // Create new appointment
            newAppointments[key] = {
                patient: prompt('Enter patient name:'),
                date: selectedDate
            };
            
            // Update time slots
            const updatedSlots = timeSlots.map(s => 
                s.time === slot.time 
                    ? { ...s, available: false, appointment: newAppointments[key] }
                    : s
            );
            
            setAppointments(newAppointments);
            setTimeSlots(updatedSlots);
        } else {
            // Remove appointment
            delete newAppointments[key];
            
            const updatedSlots = timeSlots.map(s => 
                s.time === slot.time 
                    ? { ...s, available: true, appointment: null }
                    : s
            );
            
            setAppointments(newAppointments);
            setTimeSlots(updatedSlots);
        }
    };

    return (
        <section className="week-schedule">
            <h2>Appointments for {selectedDate ? selectedDate.toLocaleDateString() : 'Select a Date'}</h2>
            <div className="time-slots">
                {timeSlots.map((slot, index) => (
                    <div 
                        key={slot.time} 
                        className={`time-slot ${slot.available ? 'available' : 'booked'}`}
                        onClick={() => handleSlotClick(slot)}
                    >
                        <div className="time">{slot.time}</div>
                        {slot.appointment && (
                            <div className="appointment-details">
                                {slot.appointment.patient}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Week;