import React, { useState, useEffect } from 'react';
import './week.css';
import AppointmentService from '../../../../../services/appointmentService';

const Week = ({ selectedDate }) => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [editingSlot, setEditingSlot] = useState(null);
    const getStatusText = (slot) => {
        // Si no hay cita, no mostramos estado
        if (!slot.appointment) return '';
        
        // Si no hay status definido, asumimos 'pending'
        const status = slot.status || 'pending';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getSlotClassName = (slot) => {
        if (!slot.appointment) return 'available';
        
        const status = slot.status || 'pending';
        const isConfirmed = slot.appointment?.confirmAppointment;
        
        if (status === 'completed') return 'completed';
        if (isConfirmed) return 'confirmed';
        return 'booked';
    };

    const generateTimeSlots = async () => {
        try {
            const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
            
            // Get existing appointments for the selected date
            const existingSlots = await AppointmentService.getAppointmentsByDate(dateStr);
            
            const slots = [];
            const initHour = 9;
            const finishHour = 19;
            
            for (let hour = initHour; hour < finishHour; hour++) {
                const timeString = `${hour.toString().padStart(2, '0')}:00`;
                
                // Find existing slot
                const existingSlot = existingSlots.find(slot => slot.appointmentTime === timeString);
                
                if (existingSlot) {
                    slots.push({
                        ...existingSlot,
                        id: existingSlot._id
                    });
                } else {
                    slots.push({
                        _id: `${dateStr}-${timeString}`,
                        date: dateStr,
                        appointmentTime: timeString,
                        realAppointmentTime: timeString,
                        available: true,
                        status: 'pending',
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

    const handleCreateAppointment = async (slot) => {
        try {
            const patientName = prompt('Enter patient name:');
            if (!patientName) return;
            
            const reason = prompt('Enter appointment reason:');
            if (!reason) return;
            
            const appointmentData = {
                date: selectedDate.toISOString().split('T')[0],
                appointmentTime: slot.appointmentTime,
                realAppointmentTime: slot.appointmentTime,
                available: true,
                status: 'pending',
                appointment: {
                    confirmAppointment: false,
                    name: patientName,
                    reason: reason
                }
            };

            const response = await AppointmentService.createAppointment(appointmentData);
            
            setTimeSlots(prevSlots => 
                prevSlots.map(s => 
                    s.appointmentTime === slot.appointmentTime 
                        ? { ...response, id: response._id }
                        : s
                )
            );
        } catch (err) {
            setError(err.message);
            alert('Error creating appointment: ' + err.message);
        }
    };

    const handleSlotClick = (slot) => {
        if (!slot.appointment) {
            handleCreateAppointment(slot);
        }
    };

    const handleDelete = async (event, slot) => {
        event.stopPropagation();
        try {
            const confirmation = window.confirm('¿Está seguro que desea eliminar esta cita?');
            if (confirmation) {
                await AppointmentService.deleteAppointment(slot.date, slot.appointmentTime);
                
                setTimeSlots(prevSlots => 
                    prevSlots.map(s => 
                        s.appointmentTime === slot.appointmentTime
                            ? { ...s, appointment: null, status: 'pending' }
                            : s
                    )
                );
            }
        } catch (err) {
            setError(err.message);
            alert('Error deleting appointment: ' + err.message);
        }
    };

    const handleConfirmClick = async (event, slot) => {
        event.stopPropagation();
        try {
            const confirmation = window.confirm('¿Desea confirmar esta cita?');
            if (confirmation) {
                await AppointmentService.confirmAppointment(slot.id, { confirmAppointment: true });
                
                setTimeSlots(prevSlots => 
                    prevSlots.map(s => 
                        s.id === slot.id 
                            ? {
                                ...s,
                                status: 'confirmed',
                                appointment: {
                                    ...s.appointment,
                                    confirmAppointment: true
                                }
                              }
                            : s
                    )
                );
            }
        } catch (err) {
            setError(err.message);
            alert('Error confirming appointment: ' + err.message);
        }
    };

    const handleComplete = async (event, slot) => {
        event.stopPropagation();
        try {
            const confirmation = window.confirm('¿Confirmar que el paciente fue atendido?');
            if (confirmation) {
                await AppointmentService.completeAppointment(slot.id);
                
                setTimeSlots(prevSlots => 
                    prevSlots.map(s => 
                        s.id === slot.id 
                            ? { ...s, status: 'completed' }
                            : s
                    )
                );
            }
        } catch (err) {
            setError(err.message);
            alert('Error marking appointment as completed: ' + err.message);
        }
    };

    const handleEdit = async (event, slot) => {
        event.stopPropagation();
        try {
            const newName = prompt('Enter new patient name:', slot.appointment.name);
            if (!newName) return;

            const newReason = prompt('Enter new appointment reason:', slot.appointment.reason);
            if (!newReason) return;

            const updatedAppointmentData = {
                ...slot,
                appointment: {
                    ...slot.appointment,
                    name: newName,
                    reason: newReason
                }
            };

            // Aquí deberías tener un endpoint para actualizar la cita
            // await AppointmentService.updateAppointment(slot.id, updatedAppointmentData);

            setTimeSlots(prevSlots => 
                prevSlots.map(s => 
                    s.id === slot.id 
                        ? updatedAppointmentData
                        : s
                )
            );
        } catch (err) {
            setError(err.message);
            alert('Error editing appointment: ' + err.message);
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
                {timeSlots.map((slot) => {
                    const isConfirmed = slot.appointment?.confirmAppointment;
                    const isCompleted = slot.status === 'completed';
                    return (
                        <div 
                            key={`${slot._id}-${slot.appointmentTime}`}
                            className={`time-slot ${getSlotClassName(slot)}`}
                            onClick={() => !slot.appointment && handleSlotClick(slot)}
                        >
                            <div className="time">{slot.appointmentTime}</div>
                            {slot.appointment && (
                                <div className="appointment-details">
                                    <div className="patient-name">{slot.appointment.name}</div>
                                    <div className="reason">{slot.appointment.reason}</div>
                                    {getStatusText(slot) && (
                                        <div className="appointment-status">
                                            Status: {getStatusText(slot)}
                                        </div>
                                    )}
                                    <div className="appointment-actions">
                                        {!isCompleted && !isConfirmed && (
                                            <button 
                                                className="confirm-button"
                                                onClick={(e) => handleConfirmClick(e, slot)}
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        {isConfirmed && !isCompleted && (
                                            <button 
                                                className="complete-button"
                                                onClick={(e) => handleComplete(e, slot)}
                                            >
                                                Mark as Completed
                                            </button>
                                        )}
                                        {!isCompleted && (
                                            <>
                                                <button 
                                                    className="edit-button"
                                                    onClick={(e) => handleEdit(e, slot)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="delete-button"
                                                    onClick={(e) => handleDelete(e, slot)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Week;