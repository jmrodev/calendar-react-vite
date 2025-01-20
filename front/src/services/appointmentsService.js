import config from '../config/env.cfg';
import { _getHeaders, handleUnauthorizedError } from './utils';
import { createStructuredDate } from '../utils/dateUtils';
import { getAuthToken } from '../utils/authUtils';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import showToast from '../utils/toastUtils';

// Manejador de errores de autenticación
const handleAuthError = (error) => {
  if (error.message.includes('401') || error.message.includes('403') || 
      error.message.toLowerCase().includes('unauthorized') || 
      error.message.toLowerCase().includes('token')) {
    store.dispatch(logout());
    showToast('Su sesión ha expirado, por favor inicie sesión nuevamente', 'warning');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }
  throw error;
};

// Funciones del servicio
const getAppointmentsByDate = async (date) => {
  try {
    // Convertir la fecha a string en formato ISO
    const dateString = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    console.log('Sending date to backend:', dateString);
    
    const response = await fetch(`${config.baseUrl}/appointments/date/${dateString}`, {
      headers: _getHeaders()
    });
    handleUnauthorizedError(response);
    return await response.json();
  } catch (error) {
    handleAuthError(error);
  }
};

const getWeekAppointments = async (startDate, endDate) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/week?start=${startDate}&end=${endDate}`, {
      headers: _getHeaders()
    });
    handleUnauthorizedError(response);
    return await response.json();
  } catch (error) {
    handleAuthError(error);
  }
};

const getByWeekDay = async (day) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/weekday/${day}`, {
      headers: _getHeaders()
    });
    handleUnauthorizedError(response);
    const data = await response.json();
    return data || []; // Asegurarnos de devolver un array vacío si no hay datos
  } catch (error) {
    handleAuthError(error);
    return []; // Devolver array vacío en caso de error
  }
};

const getAll = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments`, {
      headers: _getHeaders()
    });
    handleUnauthorizedError(response);
    return await response.json();
  } catch (error) {
    handleAuthError(error);
  }
};

const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments`, {
      method: 'POST',
      headers: _getHeaders(),
      body: JSON.stringify(appointmentData)
    });
    handleUnauthorizedError(response);
    return await response.json();
  } catch (error) {
    handleAuthError(error);
  }
};

const updateAppointment = async (id, updates) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/update/${id}`, {
      method: 'PUT',
      headers: _getHeaders(),
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar la cita');
    }

    handleUnauthorizedError(response);
    const data = await response.json();
    return data.data; // Retornar los datos actualizados
  } catch (error) {
    console.error('Error updating appointment:', error);
    handleAuthError(error);
    throw error;
  }
};

const deleteAppointment = async (id) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/${id}`, {
      method: 'DELETE',
      headers: _getHeaders()
    });
    handleUnauthorizedError(response);
    return await response.json();
  } catch (error) {
    handleAuthError(error);
  }
};

const getByDate = async (date) => {
  try {
    // Validar que la fecha tenga los campos necesarios
    if (!date || !date.year || date.month === undefined || !date.day) {
      console.error('Invalid date object:', date);
      return [];
    }

    // Convertir la fecha a string en formato ISO
    const dateString = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    console.log('Sending date to backend:', dateString);
    
    const response = await fetch(`${config.baseUrl}/appointments/date/${dateString}`, {
      headers: _getHeaders()
    });
    handleUnauthorizedError(response);
    const data = await response.json();
    console.log('Appointments data received:', data);
    
    // Asegurarnos de devolver siempre un array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in getByDate:', error);
    handleAuthError(error);
    return []; // Devolver array vacío en caso de error
  }
};

// Exportar el objeto de servicio con todas las funciones
export const appointmentsService = {
  getByDate,
  getWeekAppointments,
  getByWeekDay,
  getAll,
  create: createAppointment,
  update: updateAppointment,
  delete: deleteAppointment
};

// Exportar funciones individuales
export {
  getAppointmentsByDate,
  getWeekAppointments,
  getByWeekDay,
  getAll,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getByDate
};
