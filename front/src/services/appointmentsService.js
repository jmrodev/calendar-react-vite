import { _getHeaders, _handleError } from "./utils";
import config from "../config/env.cfg";

export const updateAppointment = async (id, appointment) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/update/${id}`, {
      method: "PUT",
      headers: _getHeaders(),
      body: JSON.stringify(appointment),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al actualizar la cita");
    }

    return await response.json();
  } catch (error) {
    _handleError("updateAppointment", error);
  }
};

export const deleteAppointment = async (id) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/${id}`, {
      method: "DELETE",
      headers: _getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al eliminar la cita");
    }

    return await response.json();
  } catch (error) {
    _handleError("deleteAppointment", error);
  }
};

export const completeAppointment = async (id) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/complete/${id}`, {
      method: "PUT",
      headers: _getHeaders(),
      body: JSON.stringify({ completed: true }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al completar la cita");
    }

    return await response.json();
  } catch (error) {
    _handleError("completeAppointment", error);
  }
};

export const confirmAppointment = async (id, data = {}) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/confirm/${id}`, {
      method: "PUT",
      headers: _getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al confirmar la cita");
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    _handleError("confirmAppointment", error);
  }
};

export const createAppointment = async (appointment) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments`, {
      method: "POST",
      headers: _getHeaders(),
      body: JSON.stringify(appointment),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear la cita");
    }

    return await response.json();
  } catch (error) {
    _handleError("createAppointment", error);
  }
};

export const getAllAppointments = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments`, {
      headers: _getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las citas");
    }

    return await response.json();
  } catch (error) {
    _handleError("getAllAppointments", error);
  }
};

export const getAppointmentsByDate = async (date) => {
  try {
    const response = await fetch(`${config.baseUrl}/appointments/date/${date}`, {
      headers: _getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al obtener las citas por fecha"
      );
    }

    return await response.json();
  } catch (error) {
    _handleError("getAppointmentsByDate", error);
  }
};
