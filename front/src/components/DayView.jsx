import React, { useEffect, useState } from 'react';
import { getAppointmentsByDate } from '../services/appointmentsService';
import { formatStructuredDate } from '../utils/dateUtils';
import AppointmentForm from './AppointmentForm';
import ErrorMessage from '../messages/ErrorMessage';
import './styles/dayView.css';
import showToast from '../utils/toastUtils';

const DayView = ({ selectedDate }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointmentsByDate(selectedDate);
      setAppointments(data);
      setError(null);
    } catch (err) {
      if (err.message === 'Sesión expirada') {
        // El error ya fue manejado por el servicio
        return;
      }
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAppointments();
    }
  }, [selectedDate]);

  const isSlotAvailable = (time) => {
    return !appointments.some(apt => apt.appointmentTime === time);
  };

  const handleTimeSlotClick = (time) => {
    const dateObj = new Date(selectedDate);
    const formattedDate = dateObj.toISOString().split('T')[0];
    
    setSelectedSlot({ 
      date: formattedDate,
      time: time 
    });
    setShowForm(true);
  };

  if (loading) {
    return <div className="loading">Cargando citas...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section className="day-view">
      <h2 className="section-title">
        Citas para el {formatStructuredDate(selectedDate)}
      </h2>

      <div className="time-slots-container">
        {timeSlots.map(time => {
          const appointment = appointments.find(apt => apt.appointmentTime === time);
          const available = isSlotAvailable(time);

          return (
            <div
              key={time}
              className={`time-slot ${available ? 'available' : 'occupied'}`}
              onClick={() => available && handleTimeSlotClick(time)}
            >
              <span className="time">{time}</span>
              {appointment && (
                <div className="appointment-info">
                  <span className="patient-name">{appointment.patientName}</span>
                  <span className="treatment">{appointment.reason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showForm && selectedSlot && (
        <AppointmentForm
          date={selectedSlot.date}
          time={selectedSlot.time}
          onClose={() => {
            setShowForm(false);
            setSelectedSlot(null);
          }}
          onSuccess={() => {
            fetchAppointments();
            setShowForm(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </section>
  );
};

export default DayView; 