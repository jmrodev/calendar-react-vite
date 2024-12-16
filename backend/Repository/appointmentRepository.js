import { AppointmentSchema } from "../Models/AppointmentSchema.js";
import { standardizeDate } from "../Utils/date/dateUtils.js";

export const completeAppointmentRepository = async (appointmentId) => {
  try {
    const appointment = await AppointmentSchema.findOne(appointmentId);
    appointment.status = "completed";
    return await appointment.save();
  } catch (error) {
    throw new Error(`Error in completeAppointmentRepository: ${error.message}`);
  }
};

export const confirmAppointmentRepository = async (appointmentId) => {
  try {
    const appointment = await AppointmentSchema.findOne(appointmentId);
    appointment.appointment.confirmAppointment = true;
    return await appointment.save();
  } catch (error) {
    throw new Error(`Error in confirmAppointmentRepository: ${error.message}`);
  }
};

export const createAppointmentRepository = async (appointmentData) => {
  try {
    const appointment = await AppointmentSchema.create(appointmentData);
    return await appointment.save();
  } catch (error) {
    throw new Error(
      `Error en createAppointmentRepository: al crear la cita: ${error.message}`
    );
  }
};

export const deleteAppointmentRepository = async (id) => {
  try {
    const appointment = await AppointmentSchema.find({ _id: Number(id) });
    if (!appointment) {
      throw new Error(
        "Error en deleteAppointmentRepository: Cita no encontrada para eliminar"
      );
    } else {
      await AppointmentSchema.remove({ _id: Number(id) });
    }
    return appointment;
  } catch (error) {
    throw new Error(
      `Error en deleteAppointmentRepository: al eliminar la cita: ${error.message}`
    );
  }
};

export const getAllAppointmentsRepository = async () => {
  try {
    return await AppointmentSchema.find();
  } catch (error) {
    throw new Error(
      `Error en getAllAppointmentsRepository: al obtener todas las citas: ${error.message}`
    );
  }
};

export const getAppointmentByDateRepository = async (date) => {
  try {
    const standardizedDate = standardizeDate(date);

    if (!standardizedDate) {
      console.error("Invalid date after standardization:", date);
      throw new Error("Invalid date format");
    }

    const appointments = await AppointmentSchema.find({
      date: standardizedDate,
    });

    return appointments;
  } catch (error) {
    console.error("Repository Error:", {
      message: error.message,
      stack: error.stack,
      originalDate: date,
    });
    throw error;
  }
};

export const getAppointmentByIdRepository = async (id) => {
  try {
    const appointment = await AppointmentSchema.find({ _id: Number(id) });
    if (!appointment || appointment.length === 0) {
      throw new Error(
        "Error en getAppointmentByIdRepository: Cita no encontrada"
      );
    }
    return appointment[0];
  } catch (error) {
    throw new Error(
      `Error en getAppointmentByIdRepository: al obtener la cita por ID: ${error.message}`
    );
  }
};

export const getConfirmedAppointmentsRepository = async () => {
  try {
    const confirmedAppointments = await AppointmentSchema.find({
      "appointment.confirmAppointment": true,
    });
    return confirmedAppointments;
  } catch (error) {
    throw new Error(
      `Error in getConfirmedAppointmentsRepository: ${error.message}`
    );
  }
};

export const updateAppointmentRepository = async (id, appointment) => {
  console.log("updateAppointmentRepository", id);

  try {
    const numericId = Number(id);
    const existingAppointments = await AppointmentSchema.findOne({
      _id: numericId,
    });

    console.log("existingAppointments", existingAppointments);
    if (!existingAppointments) {
      throw new Error("Appointment not found");
    }

    const updatedAppointment = await AppointmentSchema.update(
      { _id: numericId },
      appointment
    );

    console.log("updatedAppointment", updatedAppointment);

    return updatedAppointment.save();
  } catch (error) {
    console.error("Update Error:", error);
    throw new Error(`Error in editAppointmentRepository: ${error.message}`);
  }
};
