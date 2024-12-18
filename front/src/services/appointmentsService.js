import { _getHeaders, handleUnauthorizedError } from "./utils";
import config from "../config/env.cfg";

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

export const confirmAppointment = async (id, data = {}) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/confirm/${id}`, {
      method: "PUT",
      headers: _getHeaders(),
      body: JSON.stringify(data),
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al confirmar la cita");
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

export const createAppointment = async (appointment) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments`, {
      method: "POST",
      headers: _getHeaders(),
      body: JSON.stringify(appointment),
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear la cita");
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
    const response = await fetch(`${config.baseUrl}/appointments/date/${date}`, {
      headers: _getHeaders(),
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al obtener las citas por fecha"
      );
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
