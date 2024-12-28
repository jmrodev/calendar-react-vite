import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchMonthAppointments, fetchWeekDayAppointments } from '../redux/slices/appointmentsSlice';
import { createAppointment } from '../services/appointmentsService';
import showToast from '../utils/toastUtils';
import './styles/appointmentForm.css';
import { standardizeDate } from '../utils/dateUtils';

const AppointmentForm = ({ selectedDate, selectedTime, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  
  // Validar y formatear la fecha antes de usarla
  const initialDate = React.useMemo(() => {
    if (!selectedDate || !(selectedDate instanceof Date)) {
      console.error("Invalid selectedDate:", selectedDate);
      return null;
    }
    const formattedDate = standardizeDate(selectedDate);
    console.log("Formatted date:", formattedDate);
    return formattedDate;
  }, [selectedDate]);

  const [formData, setFormData] = useState({
    patientName: '',
    reason: '',
    appointmentTime: selectedTime,
    date: initialDate
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date) {
      showToast("Fecha inválida", "error");
      return;
    }
    if (!formData.patientName.trim() || !formData.reason.trim()) {
      showToast("Por favor complete todos los campos", "error");
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        date: formData.date,
        appointmentTime: formData.appointmentTime,
        realAppointmentTime: formData.appointmentTime,
        available: false,
        status: "pending",
        appointment: {
          confirmAppointment: false,
          name: formData.patientName,
          reason: formData.reason,
        },
      };

      await createAppointment(appointmentData);

      await Promise.all([
        dispatch(fetchMonthAppointments({
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth()
        })),
        dispatch(fetchWeekDayAppointments())
      ]);

      showToast("Cita creada exitosamente", "success");
      
      if (onSuccess) {
        await onSuccess();
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      showToast(error.message || "Error al crear la cita", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-form-container">
      <form onSubmit={handleSubmit} className="appointment-form">
        <h2 className='appointment-form-title'>Nueva Cita - {formData.appointmentTime}hs</h2>
        
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
          <label htmlFor="reason">Motivo de la Cita:</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Cita'}
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm; 