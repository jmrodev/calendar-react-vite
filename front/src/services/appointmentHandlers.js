import config from '../config/env.cfg';
import { _getHeaders, handleUnauthorizedError } from './utils';
import { createStructuredDate } from '../utils/dateUtils';

export const getWeekAppointments = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${config.baseUrl}/appointments/week?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
      {
        headers: _getHeaders()
      }
    );

    handleUnauthorizedError(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener las citas');
    }

    const data = await response.json();
    return data.map(appointment => ({
      ...appointment,
      date: createStructuredDate(appointment.date)
    }));
  } catch (error) {
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments`, {
      method: 'POST',
      headers: _getHeaders(),
      body: JSON.stringify(appointmentData)
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear la cita');
    }

    const data = await response.json();
    return {
      ...data,
      date: createStructuredDate(data.date)
    };
  } catch (error) {
    throw error;
  }
};

export const updateAppointment = async (id, updates) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/${id}`, {
      method: 'PUT',
      headers: _getHeaders(),
      body: JSON.stringify(updates)
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar la cita');
    }

    const data = await response.json();
    return {
      ...data,
      date: createStructuredDate(data.date)
    };
  } catch (error) {
    throw error;
  }
};

export const deleteAppointment = async (id) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/${id}`, {
      method: 'DELETE',
      headers: _getHeaders()
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar la cita');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
