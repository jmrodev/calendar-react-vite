import React, { useEffect, useState, useCallback } from 'react';
import { appointmentsService } from '../../services/appointmentsService';
import { formatStructuredDate } from '../../utils/dateUtils';
import AppointmentForm from './AppointmentForm';
import ErrorMessage from '../common/ErrorMessage';
import '../../styles/components/appointments/dayView.css';
import showToast from '../../utils/toastUtils';
import { useNavigate } from 'react-router-dom';

const DayView = ({ selectedDate }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const fetchAppointments = useCallback(async () => {
    if (!selectedDate || !selectedDate.year || selectedDate.month === undefined || !selectedDate.day) {
      console.log('No valid date selected:', selectedDate);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching appointments for structured date:', selectedDate);
      const data = await appointmentsService.getByDate(selectedDate);
      console.log('Appointments received:', data);
      
      setAppointments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      if (err.message.includes('401') || err.message.includes('403')) {
        showToast('Su sesión ha expirado, por favor inicie sesión nuevamente', 'warning');
        navigate('/login');
        return;
      }
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, navigate]);

  useEffect(() => {
    let isMounted = true;

    const loadAppointments = async () => {
      if (isMounted) {
        await fetchAppointments();
      }
    };

    loadAppointments();

    return () => {
      isMounted = false;
    };
  }, [fetchAppointments]);

  const isSlotAvailable = (time) => {
    return !appointments.some(apt => apt.appointmentTime === time);
  };

  const handleTimeSlotClick = (time) => {
    if (!selectedDate) return;
    
    setSelectedSlot({ 
      date: selectedDate,
      time: time 
    });
    setShowForm(true);
  };

  const getAppointmentInfo = (appointment) => {
    if (!appointment) return null;
    
    return {
      patientName: appointment.appointment?.name || 'Sin nombre',
      reason: appointment.appointment?.reason || 'Sin motivo'
    };
  };

  if (!selectedDate) {
    return <div>Seleccione una fecha para ver las citas</div>;
  }

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
          const appointment = Array.isArray(appointments) ? 
            appointments.find(apt => apt.appointmentTime === time) : 
            null;
          const available = isSlotAvailable(time);
          const appointmentInfo = getAppointmentInfo(appointment);

          return (
            <div
              key={time}
              className={`time-slot ${available ? 'available' : 'occupied'}`}
              onClick={() => available && handleTimeSlotClick(time)}
            >
              <span className="time">{time}</span>
              {!available && appointmentInfo && (
                <div className="appointment-info">
                  <span className="patient-name">{appointmentInfo.patientName}</span>
                  <span className="treatment">{appointmentInfo.reason}</span>
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