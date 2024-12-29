import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../redux/slices/appointmentsSlice';
import TimeSlot from './TimeSlot';
import ErrorMessage from '../messages/ErrorMessage';
import './styles/appointmentList.css';

const AppointmentList = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector(state => state.appointments);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const filteredAppointments = appointments.filter(apt => {
    switch(filter) {
      case 'pending':
        return apt.status === 'pending';
      case 'confirmed':
        return apt.status === 'confirmed';
      case 'completed':
        return apt.status === 'completed';
      case 'cancelled':
        return apt.status === 'cancelled';
      default:
        return true;
    }
  });

  if (loading) {
    return <div className="loading">Cargando citas...</div>;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        onRetry={() => dispatch(fetchAppointments())}
      />
    );
  }

  return (
    <div className="appointment-list">
      <div className="appointment-list-header">
        <h2>Lista de Citas</h2>
        <div className="appointment-filters">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button 
            className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pendientes
          </button>
          <button 
            className={`filter-button ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmadas
          </button>
          <button 
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completadas
          </button>
          <button 
            className={`filter-button ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Canceladas
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <p className="no-appointments">No hay citas para mostrar</p>
      ) : (
        filteredAppointments.map(appointment => (
          <TimeSlot 
            key={appointment._id}
            appointment={appointment}
            onUpdate={() => dispatch(fetchAppointments())}
            canEdit={true}
          />
        ))
      )}
    </div>
  );
};

export default AppointmentList; 