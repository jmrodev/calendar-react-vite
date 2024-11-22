import React, { useState, useEffect } from 'react';
import './week.css';
import AppointmentService from '../../../../../services/appointmentService';

const appointmentService = new AppointmentService();

const Week = ({ selectedDate }) => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const generateTimeSlots = async () => {
        try {
            const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
            
            // Get existing appointments for the selected date
            const existingSlots = await appointmentService.getAppointmentsByDate(dateStr);
            
            const slots = [];
            const initHour = 9;
            const finishHour = 19;
            
            for (let hour = initHour; hour < finishHour; hour++) {
                const timeString = `${hour.toString().padStart(2, '0')}:00`;
                
                // Find existing slot or create new one
                const existingSlot = existingSlots.find(slot => slot.time === timeString);
                
                if (existingSlot) {
                    slots.push({
                        ...existingSlot,
                        id: `${dateStr}-${timeString}`
                    });
                } else {
                    slots.push({
                        _id: `${dateStr}-${timeString}`,
                        date: dateStr,
                        time: timeString,
                        available: true,
                        appointment: null
                    });
                }
            }
            
            return slots;
        } catch (err) {
            throw new Error('Error generating time slots: ' + err.message);
        }
    };

    useEffect(() => {
        const loadSlots = async () => {
            if (selectedDate) {
                try {
                    setLoading(true);
                    setError(null);
                    const slots = await generateTimeSlots();
                    setTimeSlots(slots);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadSlots();
    }, [selectedDate]);

    const handleSlotClick = async (slot) => {
        try {
            if (!slot.appointment) {
                const patientName = prompt('Enter patient name:');
                const reason = prompt('Enter appointment reason:');
                
                if (patientName && reason) {
                    await appointmentService.createAppointment({
                        date: slot.date,
                        time: slot.time,
                        name: patientName,
                        reason: reason
                    });
                    
                    // Refresh slots after creating appointment
                    const updatedSlots = await generateTimeSlots();
                    setTimeSlots(updatedSlots);
                }
            } else {
                const confirmation = prompt('To delete the appointment, type "SI":');
                if (confirmation === 'SI') {
                    await appointmentService.deleteAppointment(slot.date, slot.time);
                    
                    // Refresh slots after deleting appointment
                    const updatedSlots = await generateTimeSlots();
                    setTimeSlots(updatedSlots);
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (!selectedDate) {
        return <div className="week-schedule">Please select a date to view available slots.</div>;
    }

    if (loading) {
        return <div className="week-schedule">Loading appointments...</div>;
    }

    if (error) {
        return <div className="week-schedule error">Error: {error}</div>;
    }

    return (
        <section className="week-schedule">
            <h2>Appointments for {selectedDate.toLocaleDateString()}</h2>
            <div className="time-slots">
                {timeSlots.map((slot) => (
                    <div 
                        key={slot.id}
                        className={`time-slot ${slot.available && !slot.appointment ? 'available' : 'booked'}`}
                        onClick={() => handleSlotClick(slot)}
                    >
                        <div className="time">{slot.time}</div>
                        {slot.appointment && (
                            <div className="appointment-details">
                                <div>{slot.appointment.name}</div>
                                <div className="reason">{slot.appointment.reason}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Week;