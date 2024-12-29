import config from '../config/env.cfg';
import { _getHeaders, handleUnauthorizedError, handleApiError } from './utils';

export const getWeekAppointments = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${config.baseUrl}/appointments/week?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      {
        headers: _getHeaders()
      }
    );

    handleUnauthorizedError(response);
    return await handleApiError(response);
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
    return await handleApiError(response);
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
    return await handleApiError(response);
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
    return await handleApiError(response);
  } catch (error) {
    throw error;
  }
};

export const getAppointmentById = async (id) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/${id}`, {
      headers: _getHeaders()
    });

    handleUnauthorizedError(response);
    return await handleApiError(response);
  } catch (error) {
    throw error;
  }
};

export const getUserAppointments = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/user`, {
      headers: _getHeaders()
    });

    handleUnauthorizedError(response);
    return await handleApiError(response);
  } catch (error) {
    throw error;
  }
}; 