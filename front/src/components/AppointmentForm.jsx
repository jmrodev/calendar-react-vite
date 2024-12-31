import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNewAppointment } from '../redux/slices/appointmentSlice';
import { formatStructuredDate } from '../utils/dateUtils';
import ErrorMessage from '../messages/ErrorMessage';
import showToast from '../utils/toastUtils';
import './styles/appointmentForm.css';

const AppointmentForm = ({ date, time, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    reason: '',
    notes: '',
    date: date,
    time: time
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const appointmentData = {
        date: {
          year: new Date(date).getFullYear(),
          month: new Date(date).getMonth(),
          day: new Date(date).getDate(),
          hours: parseInt(time.split(':')[0]),
          minutes: parseInt(time.split(':')[1]),
          seconds: 0
        },
        appointmentTime: time,
        realAppointmentTime: time,
        available: false,
        status: "pending",
        appointment: {
          confirmAppointment: false,
          name: formData.patientName,
          reason: formData.reason
        }
      };

      console.log('Datos a enviar:', appointmentData);

      await dispatch(createNewAppointment(appointmentData)).unwrap();
      showToast('Cita agendada exitosamente', 'success');
      onClose();
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message || 'Error al crear la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="appointment-form-container">
        <div className="form-header">
          <h2>Nueva Cita</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {error && (
          <ErrorMessage 
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        <div className="appointment-info">
          <p>
            <strong>Fecha:</strong> {formatStructuredDate(new Date(date))}
          </p>
          <p>
            <strong>Hora:</strong> {time}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="patientName">Nombre del Paciente:</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="patientEmail">Email:</label>
            <input
              type="email"
              id="patientEmail"
              name="patientEmail"
              value={formData.patientEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="patientPhone">Teléfono:</label>
            <input
              type="tel"
              id="patientPhone"
              name="patientPhone"
              value={formData.patientPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason">Motivo de la Consulta:</label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notas Adicionales:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Agendando...' : 'Agendar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm; 