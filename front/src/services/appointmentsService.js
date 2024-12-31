import { _getHeaders, handleUnauthorizedError } from "./utils";
import config from "../config/env.cfg";
import { createStructuredDate, formatStructuredDate } from "../utils/dateUtils";
import { getAuthToken } from '../utils/authUtils';

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

export const createAppointment = async (appointment) => {
  try {
    if (!appointment.date || !appointment.appointmentTime) {
      throw new Error("Fecha y hora son requeridos");
    }

    const response = await fetch(`${config.baseUrl}/appointments`, {
      method: "POST",
      headers: _getHeaders(),
      body: JSON.stringify(appointment),
    });

    // Obtener el texto del error primero
    const responseText = await response.text();
    let errorData;
    
    try {
      // Intentar parsearlo como JSON
      errorData = JSON.parse(responseText);
    } catch {
      // Si no es JSON, usar el texto directamente
      errorData = { message: responseText };
    }

    if (!response.ok) {
      throw new Error(errorData.error || errorData.message || "Error al crear la cita");
    }

    // Si llegamos aquí, la respuesta fue exitosa
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error detallado en createAppointment:', error);
    // Asegurarnos de que siempre devolvemos un mensaje de error útil
    throw new Error(error.message || "Error al crear la cita");
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

    handleUnauthorizedError(response);

    if (!response.ok) {
      throw new Error('Error al obtener las citas');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getAppointmentsByDate:', error);
    throw error;
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
