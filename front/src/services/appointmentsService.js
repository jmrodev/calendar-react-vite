import { _getHeaders, handleUnauthorizedError } from "./utils";
import config from "../config/env.cfg";
import { createStructuredDate, formatStructuredDate } from "../utils/dateUtils";

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
    const structuredDate = createStructuredDate(appointment.date);
    if (!structuredDate) {
      throw new Error("Fecha inválida");
    }

    const response = await fetch(`${config.baseUrl}/appointments`, {
      method: "POST",
      headers: _getHeaders(),
      body: JSON.stringify({
        ...appointment,
        date: structuredDate
      }),
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al crear la cita");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getAllAppointments = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments`, {
      headers: _getHeaders(),
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las citas");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getAppointmentsByDate = async (date) => {
  try {
    const structuredDate = createStructuredDate(date);
    if (!structuredDate) {
      throw new Error("Fecha inválida");
    }

    const response = await fetch(
      `${config.baseUrl}/appointments/date/${encodeURIComponent(JSON.stringify(structuredDate))}`,
      {
        headers: _getHeaders(),
      }
    );

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las citas por fecha");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getAppointmentsByWeekDay = async (dayOfWeek) => {
  try {
    // Convertir número a nombre del día
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = weekDays[dayOfWeek];

    const response = await fetch(`${config.baseUrl}/appointments/weekday/${dayName}`, {
      headers: _getHeaders(),
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las citas por día de la semana");
    }

    return await response.json();
  } catch (error) {
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

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las citas de la semana");
    }

    return await response.json();
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
