import { AppointmentSchema } from "../Models/AppointmentSchema.js";
import { createLog } from "./logRepository.js";
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

export const createAppointmentRepository = async (appointmentData, secretaryId, secretaryName) => {
  try {
    const standardizedDate = standardizeDate(appointmentData.date);
    if (!standardizedDate) {
      throw new Error("Invalid appointment date format");
    }

    const appointment = await AppointmentSchema.create({
      ...appointmentData,
      date: standardizedDate,
      secretary: {
        id: secretaryId,
        name: secretaryName
      },
      changeLog: [{
        date: new Date(),
        action: "created",
        description: "Cita creada",
        secretaryId: secretaryId,
        newStatus: appointmentData.status
      }]
    });

    await createLog({
      userId: secretaryId,
      action: "create",
      entityType: "appointment",
      entityId: appointment._id,
      description: "Creación de nueva cita",
      details: {
        patientName: appointmentData.appointment.name,
        appointmentDate: standardizedDate
      }
    });

    return await appointment.save();
  } catch (error) {
    throw new Error(`Error en createAppointmentRepository: ${error.message}`);
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

export const updateAppointmentRepository = async (id, appointment, secretaryId) => {
  try {
    const existingAppointment = await AppointmentSchema.findOne({ _id: Number(id) });
    if (!existingAppointment) {
      throw new Error("Appointment not found");
    }

    const logEntry = {
      date: new Date(),
      action: "updated",
      description: "Cita actualizada",
      secretaryId: secretaryId,
      previousStatus: existingAppointment.status,
      newStatus: appointment.status || existingAppointment.status
    };

    const updatedAppointment = await AppointmentSchema.update(
      { _id: Number(id) },
      {
        ...appointment,
        changeLog: [...existingAppointment.changeLog, logEntry]
      }
    );

    await createLog({
      userId: secretaryId,
      action: "update",
      entityType: "appointment",
      entityId: id,
      description: "Actualización de cita",
      details: {
        previousStatus: existingAppointment.status,
        newStatus: appointment.status || existingAppointment.status
      }
    });

    return updatedAppointment;
  } catch (error) {
    throw new Error(`Error in updateAppointmentRepository: ${error.message}`);
  }
};

export const getAppointmentsByWeekDayRepository = async (dayOfWeek) => {
  console.log("repository", dayOfWeek);
  
  try {
    const allAppointments = await AppointmentSchema.find();
    
    const appointments = allAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date.split('/').reverse().join('-'));
      let dayOfWeektransf = parseInt(dayOfWeek);
      console.log(`Cita fecha: ${appointment.date}, día: ${appointmentDate.getDay() + 1}, buscando día: ${dayOfWeektransf}`);
      
      return (appointmentDate.getDay() + 1) === dayOfWeektransf;
    });
    
    appointments.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      return a.appointmentTime.localeCompare(b.appointmentTime);
    });

    return appointments;
  } catch (error) {
    throw new Error(`Error en repositorio: ${error.message}`);
  }
};
