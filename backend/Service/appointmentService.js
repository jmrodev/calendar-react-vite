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

export const completeAppointmentService = async (appointmentId) => {
  try {
    return await completeAppointmentRepository(appointmentId);
  } catch (error) {
    throw new Error(`Error in confirm appointment service: ${error.message}`);
  }
};

export const confirmAppointmentService = async (appointmentId) => {
  try {
    return await confirmAppointmentRepository(appointmentId);
  } catch (error) {
    throw new Error(`Error in confirm appointment service: ${error.message}`);
  }
};

export const createAppointmentService = async (appointmentData) => {
  try {
    const { date, appointmentTime, appointment } = appointmentData;

    if (!date || !appointmentTime || !appointment.name) {
      throw new Error("Date, appointment time and patient name are required");
    }
    const newAppointment = {
      _id: newAppointmentId(),
      ...appointmentData,
    };
    return await createAppointmentRepository(newAppointment);
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
    const appointments = await getAppointmentByDateRepository(date);
    // if (!appointments.length) {
    //     return { status: 404, data: { message: 'No se encontraron citas para esta fecha' } };
    // }
    return { status: 200, data: appointments };
  } catch (error) {
    return { status: 500, data: { message: error.message } };
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

export const updateAppointmentService = async (id, data) => {
  try {
    return await updateAppointmentRepository(id, data);
  } catch (error) {
    throw new Error(`Error in update appointment service: ${error.message}`);
  }
};

export const getAppointmentsByWeekDayService = async (dayOfWeek) => {
  try {
    const appointments = await getAppointmentsByWeekDayRepository(dayOfWeek);
    return appointments;
  } catch (error) {
    throw new Error(`Error al obtener citas por día de la semana: ${error.message}`);
  }
};
