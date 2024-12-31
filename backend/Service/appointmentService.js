import {
  completeAppointmentRepository,
  confirmAppointmentRepository,
  createAppointmentRepository,
  deleteAppointmentRepository,
  getAllAppointmentsRepository,
  getAppointmentByDateRepository,
  getAppointmentByIdRepository,
  getConfirmedAppointmentsRepository,
  updateAppointmentRepository,
  getAppointmentsByWeekDayRepository,
} from "../Repository/appointmentRepository.js";
import { newAppointmentId } from "../Utils/id/appointment.js";
import { createStructuredDate, formatStructuredDate, standardizeDate } from "../Utils/date/dateUtils.js";

export const completeAppointmentService = async (appointmentId) => {
  try {
    return await completeAppointmentRepository(appointmentId);
  } catch (error) {
    throw new Error(`Error in confirm appointment service: ${error.message}`);
  }
};

export const confirmAppointmentService = async (appointmentId) => {
  try {
    const appointment = await confirmAppointmentRepository(appointmentId);
    if (!appointment) {
      throw new Error('No se encontró la cita');
    }
    return appointment;
  } catch (error) {
    console.error('Error en confirmAppointmentService:', error);
    throw new Error(`Error al confirmar la cita: ${error.message}`);
  }
};

export const createAppointmentService = async (appointmentData, secretaryId, secretaryName) => {
  try {
    const { date, appointmentTime, appointment } = appointmentData;

    if (!date || !appointmentTime || !appointment.name) {
      throw new Error("Date, appointment time and patient name are required");
    }

    const structuredDate = createStructuredDate(date);
    if (!structuredDate) {
      throw new Error("Invalid date format");
    }

    const newAppointment = {
      _id: newAppointmentId(),
      ...appointmentData,
      date: structuredDate
    };

    return await createAppointmentRepository(newAppointment, secretaryId, secretaryName);
  } catch (error) {
    throw new Error(`Error in create appointment service: ${error.message}`);
  }
};

export const deleteAppointmentService = async (id) => {
  try {
    return await deleteAppointmentRepository(id);
  } catch (error) {
    throw new Error(`Error in delete appointment service: ${error.message}`);
  }
};

export const getAllAppointmentsService = async () => {
  try {
    return await getAllAppointmentsRepository();
  } catch (error) {
    throw new Error(`Error in get all appointments service: ${error.message}`);
  }
};

export const getAppointmentByDateService = async (date) => {
  try {    
    const structuredDate = createStructuredDate(date);
    if (!structuredDate) {
      throw new Error("Invalid date format");
    }

    const appointments = await getAppointmentByDateRepository(structuredDate);
    return { 
      status: 200, 
      data: appointments 
    };
  } catch (error) {
    return { 
      status: 500, 
      data: { message: error.message } 
    };
  }
};

export const getAppointmentById = async (id) => {
  try {
    return await getAppointmentByIdRepository(id);
  } catch (error) {
    throw new Error(`Error in get appointment by id service: ${error.message}`);
  }
};

export const getConfirmedAppointmentsService = async () => {
  try {
    return await getConfirmedAppointmentsRepository();
  } catch (error) {
    throw new Error(
      `Error in get confirmed appointments service: ${error.message}`
    );
  }
};

export const updateAppointmentService = async (id, data, secretaryId) => {
  try {
    return await updateAppointmentRepository(id, data, secretaryId);
  } catch (error) {
    throw new Error(`Error in update appointment service: ${error.message}`);
  }
};

export const getAppointmentsByWeekDayService = async (dayOfWeek) => {
  try {
    const currentDate = standardizeDate(new Date());
    if (!currentDate) {
      throw new Error('Fecha inválida');
    }

    const appointments = await getAppointmentsByWeekDayRepository(dayOfWeek, currentDate);
    return appointments;
  } catch (error) {
    console.error('Error en getAppointmentsByWeekDayService:', error);
    throw new Error(`Error al obtener citas por día de la semana: ${error.message}`);
  }
};
