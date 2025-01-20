import { appointmentRepository } from "../Repository/appointmentRepository.js";
import { createStructuredDate, standardizeDate } from "../Utils/date/dateUtils.js";

export const getFilteredAppointmentsService = async (filters) => {
  try {
    const appointments = await appointmentRepository.findByFilters(filters);
    return {
      success: true,
      data: appointments,
      filters
    };
  } catch (error) {
    console.error('Error en getFilteredAppointmentsService:', error);
    throw new Error(`Error al filtrar citas: ${error.message}`);
  }
};

export const getAppointmentByIdService = async (id) => {
  try {
    const appointment = await appointmentRepository.findById(id);
    return appointment;
  } catch (error) {
    throw new Error(`Error al obtener cita: ${error.message}`);
  }
};

export const createAppointmentService = async (appointmentData) => {
  try {
    return await appointmentRepository.create(appointmentData);
  } catch (error) {
    throw new Error(`Error al crear cita: ${error.message}`);
  }
};

export const updateAppointmentService = async (id, data) => {
  try {
    return await appointmentRepository.update(id, data);
  } catch (error) {
    throw new Error(`Error al actualizar cita: ${error.message}`);
  }
};

export const deleteAppointmentService = async (id) => {
  try {
    return await appointmentRepository.delete(id);
  } catch (error) {
    throw new Error(`Error al eliminar cita: ${error.message}`);
  }
};

export const confirmAppointmentService = async (id) => {
  try {
    return await appointmentRepository.confirmAppointment(id);
  } catch (error) {
    throw new Error(`Error al confirmar cita: ${error.message}`);
  }
};

export const completeAppointmentService = async (id) => {
  try {
    return await appointmentRepository.completeAppointment(id);
  } catch (error) {
    throw new Error(`Error al completar cita: ${error.message}`);
  }
};
