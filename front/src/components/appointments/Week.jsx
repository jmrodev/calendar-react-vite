import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeekAppointments } from '../redux/slices/appointmentSlice';
import { getWeekDates, formatStructuredDate } from '../utils/dateUtils';
import ErrorMessage from '../messages/ErrorMessage';
import AppointmentForm from './AppointmentForm';
import './styles/week.css';

const Week = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error, selectedDate } = useSelector(state => state.appointments);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const weekDates = getWeekDates(selectedDate || new Date());

  useEffect(() => {
    const startDate = weekDates[0];
    const endDate = weekDates[6];
    dispatch(fetchWeekAppointments({ startDate, endDate }));
  }, [dispatch, selectedDate]);

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => 
      new Date(apt.date).toDateString() === date.toDateString()
    );
  };

  const handleTimeSlotClick = (date, time) => {
    setSelectedSlot({ date, time });
    setShowForm(true);
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const isSlotAvailable = (date, time) => {
    const appointments = getAppointmentsForDate(date);
    return !appointments.some(apt => apt.time === time);
  };

  if (loading) {
    return <div className="loading">Cargando calendario...</div>;
  }

  return (
    <section className="section week-container">
      <h2 className="section-title">Calendario Semanal</h2>

      {error && (
        <ErrorMessage 
          message={error}
          onRetry={() => {
            const startDate = weekDates[0];
            const endDate = weekDates[6];
            dispatch(fetchWeekAppointments({ startDate, endDate }));
          }}
        />
      )}

      <div className="week-grid">
        {weekDates.map((date, index) => (
          <div key={index} className="card day-column">
            <div className="day-header">
              <h3 className="text-light">{formatStructuredDate(date, { weekday: 'short' })}</h3>
              <span className="text-light">{formatStructuredDate(date, { day: 'numeric', month: 'short' })}</span>
            </div>

            <div className="time-slots">
              {timeSlots.map(time => {
                const available = isSlotAvailable(date, time);
                return (
                  <div
                    key={time}
                    className={`time-slot ${available ? 'available' : 'occupied'}`}
                    onClick={() => available && handleTimeSlotClick(date, time)}
                  >
                    <span className="time">{time}</span>
                    {!available && (
                      <div className="appointment-info text-danger">
                        {getAppointmentsForDate(date)
                          .find(apt => apt.time === time)?.patientName}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showForm && selectedSlot && (
        <AppointmentForm
          date={selectedSlot.date}
          time={selectedSlot.time}
          onClose={() => {
            setShowForm(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </section>
  );
};

export default Week;
