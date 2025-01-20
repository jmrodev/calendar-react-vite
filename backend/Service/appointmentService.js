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
  getAppointmentsByMonthRepository,
  getAppointmentsByStatusRepository,
} from "../Repository/appointmentRepository.js";
import { generateAppointmentId } from "../Utils/id/appointment.js";
import {
  createStructuredDate,
  formatStructuredDate,
  standardizeDate,
} from "../Utils/date/dateUtils.js";
import { AppointmentRepository } from "../Repository/appointmentRepository.js";
import { AppointmentSchema } from "../Models/AppointmentSchema.js";

// Instanciar el repositorio
const appointmentRepository = new AppointmentRepository();

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
      throw new Error("No se encontró la cita");
    }
    return appointment;
  } catch (error) {
    console.error("Error en confirmAppointmentService:", error);
    throw new Error(`Error al confirmar la cita: ${error.message}`);
  }
};

export const createAppointmentService = async (appointmentData) => {
  console.log('🔵 Iniciando creación de cita');
  try {
    console.log("Datos recibidos:", appointmentData);

    // Validar que no existan citas duplicadas
    console.log("🔍 Buscando citas existentes...");
    const existingAppointments = await appointmentRepository.findByDateAndTime(
      appointmentData.date,
      appointmentData.appointmentTime
    );

    console.log("📊 Total de citas encontradas:", existingAppointments.length);

    if (existingAppointments && existingAppointments.length > 0) {
      console.log("⚠ Cita duplicada encontrada:", {
        fecha: existingAppointments[0].date,
        hora: existingAppointments[0].appointmentTime,
        id: existingAppointments[0]._id
      });
      throw new Error("Ya existe una cita para esta fecha y hora");
    }

    console.log("✅ Validación exitosa: No hay citas duplicadas");

    // Crear la cita
    console.log("📝 Creando nueva cita con estructura:", appointmentData);
    const newAppointment = await appointmentRepository.create(appointmentData);
    
    if (!newAppointment) {
      throw new Error("Error al crear la cita en la base de datos");
    }

    console.log("✅ Cita creada exitosamente:", newAppointment);
    return newAppointment;

  } catch (error) {
    console.error("❌ Error en createAppointmentService:", error);
    throw new Error(`Error al crear la cita: ${error.message}`);
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
      data: appointments,
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: error.message },
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

export const updateAppointmentService = async (id, appointmentData, secretaryId) => {
  try {
    // Validaciones mejoradas
    if (!id || !appointmentData) {
      throw new Error("ID de cita y datos de actualización son requeridos");
    }

    // Verificar que el ID sea un número válido
    const appointmentId = Number(id);
    if (isNaN(appointmentId)) {
      throw new Error("ID de cita inválido");
    }

    const appointmentRepository = new AppointmentRepository();
    
    // Validar que la cita exista
    const existingAppointment = await appointmentRepository.appointments.findOne({ _id: appointmentId });
    if (!existingAppointment) {
      throw new Error("Cita no encontrada");
    }

    // Crear el log de cambios con la fecha estructurada
    const now = new Date();
    const changeLogEntry = {
      date: {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
      },
      action: "updated",
      description: "Cita actualizada",
      secretaryId: secretaryId,
      previousStatus: existingAppointment.status,
      newStatus: appointmentData.status || existingAppointment.status
    };

    // Preparar datos actualizados manteniendo la estructura correcta
    const updatedData = {
      ...existingAppointment,
      date: appointmentData.date || existingAppointment.date,
      appointmentTime: appointmentData.appointmentTime || existingAppointment.appointmentTime,
      realAppointmentTime: appointmentData.realAppointmentTime || existingAppointment.realAppointmentTime,
      available: appointmentData.available !== undefined ? appointmentData.available : existingAppointment.available,
      status: appointmentData.status || existingAppointment.status,
      appointment: {
        ...existingAppointment.appointment,
        ...appointmentData.appointment
      },
      secretary: existingAppointment.secretary,
      changeLog: [...(existingAppointment.changeLog || []), changeLogEntry]
    };

    const updatedAppointment = await appointmentRepository.updateAppointment(
      appointmentId,
      updatedData,
      secretaryId
    );

    return updatedAppointment;
  } catch (error) {
    console.error('Error en updateAppointmentService:', error);
    throw new Error(`Error al actualizar la cita: ${error.message}`);
  }
};

export const getAppointmentsByWeekDayService = async (dayOfWeek) => {
  try {
    const currentDate = standardizeDate(new Date());
    if (!currentDate) {
      throw new Error("Fecha inválida");
    }

    const appointments = await getAppointmentsByWeekDayRepository(
      dayOfWeek,
      currentDate
    );
    return appointments;
  } catch (error) {
    console.error("Error en getAppointmentsByWeekDayService:", error);
    throw new Error(
      `Error al obtener citas por día de la semana: ${error.message}`
    );
  }
};

export const getFilteredAppointmentsService = async (filters) => {
  try {
    const { date, status, month, year, weekDay } = filters;
    let appointments;

    if (date) {
      const structuredDate = createStructuredDate(date);
      appointments = await getAppointmentByDateRepository(structuredDate);
    } else if (month && year) {
      appointments = await getAppointmentsByMonthRepository(parseInt(year), parseInt(month));
    } else if (weekDay) {
      appointments = await getAppointmentsByWeekDayRepository(parseInt(weekDay));
    } else if (status) {
      appointments = await getAppointmentsByStatusRepository(status);
    } else {
      appointments = await getAllAppointmentsRepository();
    }

    return {
      success: true,
      data: appointments,
      filters: { date, status, month, year, weekDay }
    };
  } catch (error) {
    console.error('Error en getFilteredAppointmentsService:', error);
    throw new Error(`Error al filtrar citas: ${error.message}`);
  }
};
