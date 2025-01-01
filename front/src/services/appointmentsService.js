import { _getHeaders, handleUnauthorizedError } from "./utils";
import config from "../config/env.cfg";
import { createStructuredDate, formatStructuredDate } from "../utils/dateUtils";
import { getAuthToken } from '../utils/authUtils';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import showToast from '../utils/toastUtils';

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

export const updateAppointment = async (id, appointment) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/update/${id}`, {
      method: "PUT",
      headers: _getHeaders(),
      body: JSON.stringify(appointment),
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al actualizar la cita");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteAppointment = async (id) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/${id}`, {
      method: "DELETE",
      headers: _getHeaders(),
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al eliminar la cita");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const completeAppointment = async (id) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/complete/${id}`, {
      method: "PUT",
      headers: _getHeaders(),
      body: JSON.stringify({ completed: true }),
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al completar la cita");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const confirmAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/confirm/${appointmentId}`, {
      method: 'PUT',
      headers: _getHeaders(),
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al confirmar la cita');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en confirmAppointment:', error);
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    console.log('Datos enviados al servidor:', appointmentData);

    const response = await fetch(`${config.baseUrl}/appointments`, {
      method: "POST",
      headers: _getHeaders(),
      body: JSON.stringify(appointmentData),
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', data);

    if (!response.ok) {
      throw new Error(data.message || data.error || "Error al crear la cita");
    }

    // Asegurarse de que la fecha tenga el formato correcto
    return {
      ...data,
      date: data.date ? {
        year: data.date.year,
        month: data.date.month,
        day: data.date.day,
        hours: data.date.hours || 0,
        minutes: data.date.minutes || 0,
        seconds: data.date.seconds || 0
      } : null
    };
  } catch (error) {
    console.error('Error detallado en createAppointment:', error);
    throw error;
  }
};

export const getAllAppointments = async () => {
  try {
    const headers = _getHeaders();

    const response = await fetch(`${config.baseUrl}/appointments`, {
      headers
    });


    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Error de autenticación en respuesta');
      }
      throw new Error('Error al obtener las citas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAllAppointments:', error);
    throw error;
  }
};

export const getAppointmentsByDate = async (date) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/date/${date}`, {
      method: 'GET',
      headers: _getHeaders()
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401');
      }
      const errorData = await response.text();
      throw new Error(errorData || 'Error al obtener las citas');
    }

    return await response.json();
  } catch (error) {
    handleAuthError(error);
  }
};

export const getAppointmentsByWeekDay = async (dayNumber) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Enviar directamente el número del día
    const response = await fetch(`${config.baseUrl}/appointments/weekday/${dayNumber}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Error de autenticación');
      }
      throw new Error('Error al obtener las citas por día de la semana');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAppointmentsByWeekDay:', error);
    throw error;
  }
};

export const getWeekAppointments = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${config.baseUrl}/appointments/week?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      {
        headers: _getHeaders()
      }
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Error de autenticación getWeekAppointments');
      }
      throw new Error('Error al obtener las citas de la semana');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getWeekAppointments:', error);
    throw error;
  }
};

export const getUserAppointments = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/user`, {
      headers: _getHeaders()
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las citas del usuario");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const cancelAppointment = async (id) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/${id}/cancel`, {
      method: 'PUT',
      headers: _getHeaders()
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al cancelar la cita");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
