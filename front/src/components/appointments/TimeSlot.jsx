import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { formatStructuredDate } from '../../utils/dateUtils';
import { updateAppointment, deleteAppointment } from '../services/appointmentHandlers';
import showToast from '../../utils/toastUtils';
import './styles/timeSlot.css';

const TimeSlot = ({ appointment, onUpdate, canEdit }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(state => state.auth);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      await updateAppointment(appointment._id, { status: newStatus });
      showToast('Estado de la cita actualizado', 'success');
      onUpdate();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Está seguro de eliminar esta cita?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteAppointment(appointment._id);
      showToast('Cita eliminada exitosamente', 'success');
      onUpdate();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className={`time-slot ${loading ? 'loading' : ''}`}>
      <div className="time-slot-header">
        <span className="time">{formatStructuredDate(appointment.date)}</span>
        <span className={`status-badge ${getStatusClass(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>
      
      <div className="appointment-info">
        <p>Paciente: {appointment.patientName}</p>
        <p>Motivo: {appointment.reason}</p>
        {appointment.notes && <p>Notas: {appointment.notes}</p>}
      </div>

      {canEdit && (
        <div className="appointment-actions">
          {appointment.status === 'pending' && (
            <button onClick={() => handleStatusUpdate('confirmed')}>
              Confirmar
            </button>
          )}
          {appointment.status === 'confirmed' && (
            <button onClick={() => handleStatusUpdate('completed')}>
              Completar
            </button>
          )}
          {['pending', 'confirmed'].includes(appointment.status) && (
            <button onClick={() => handleStatusUpdate('cancelled')}>
              Cancelar
            </button>
          )}
          {user.role === 'admin' && (
            <button onClick={handleDelete}>
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSlot;
