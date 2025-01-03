import { AppointmentSchema } from "../Models/AppointmentSchema.js";
import { createLog } from "./logRepository.js";
import { createStructuredDate, formatStructuredDate, compareStructuredDates, standardizeDate } from "../Utils/date/dateUtils.js";
import { generateAppointmentId } from '../Utils/id/appointment.js';

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
    const appointment = await AppointmentSchema.create({
      ...appointmentData,
      date: createStructuredDate(appointmentData.date),
      secretary: {
        id: secretaryId,
        name: secretaryName
      },
      changeLog: [{
        date: createStructuredDate(new Date()),
        action: "created",
        description: "Cita creada",
        secretaryId: secretaryId,
        newStatus: appointmentData.status
      }]
    }).save();

    // await createLog({
    //   userId: secretaryId,
    //   action: "create",
    //   entityType: "appointment",
    //   entityId: appointment._id,
    //   description: "Creación de nueva cita",
    //   details: {
    //     patientName: appointmentData.appointment.name,
    //     appointmentDate: formatStructuredDate(appointment.date)
    //   }
    // }).save();

    return appointment;
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
    console.log('Searching appointments for date:', date);
    
    const appointments = await AppointmentSchema.find({
      'date.year': date.year,
      'date.month': date.month,
      'date.day': date.day
    });

    console.log('Found appointments:', appointments);
    return Array.isArray(appointments) ? appointments : [];
  } catch (error) {
    console.error('Error in getAppointmentByDateRepository:', error);
    throw new Error(`Error in getAppointmentByDateRepository: ${error.message}`);
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
  try {
    const allAppointments = await AppointmentSchema.find();
    
    const appointments = allAppointments.filter((appointment) => {
      const appointmentDate = standardizeDate(appointment.date);
      if (!appointmentDate) return false;
      
      // Convertir el dayOfWeek a número si viene como string
      const dayOfWeekNum = parseInt(dayOfWeek);
      
      // getDay() devuelve 0-6 (Domingo-Sábado)
      return appointmentDate.getDay() === dayOfWeekNum;
    });
    
    // Ordenar por fecha y hora
    appointments.sort((a, b) => {
      const dateA = standardizeDate(a.date);
      const dateB = standardizeDate(b.date);
      if (!dateA || !dateB) return 0;
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      return a.appointmentTime.localeCompare(b.appointmentTime);
    });

    return appointments;
  } catch (error) {
    console.error('Error en getAppointmentsByWeekDayRepository:', error);
    throw new Error(`Error en repositorio: ${error.message}`);
  }
};

export const getAppointmentsByMonthRepository = async (year, month) => {
  try {
    console.log('Repository: Buscando citas para:', { year, month });
    
    const appointments = await AppointmentSchema.find({
      'date.year': year,
      'date.month': month
    });
    
    console.log('Repository: Citas encontradas:', appointments.length);
    
    // Asegurarse de devolver un array vacío si no hay citas
    return Array.isArray(appointments) ? appointments : [];
    
  } catch (error) {
    console.error('Error en getAppointmentsByMonthRepository:', error);
    throw new Error(`Error al obtener las citas del mes: ${error.message}`);
  }
};

export class AppointmentRepository {
  constructor() {
    this.appointments = AppointmentSchema;
  }

  async findByDateAndTime(date, time) {
    try {
      console.log('Buscando cita por fecha y hora:', { date, time });
      const appointments = this.appointments.find({
        'date.year': date.year,
        'date.month': date.month,
        'date.day': date.day,
        appointmentTime: time
      });

      console.log('Citas encontradas:', appointments);
      return appointments;
    } catch (error) {
      console.error('Error en findByDateAndTime:', error);
      throw error;
    }
  }

  async findByDate(date) {
    try {
      console.log('Buscando citas por fecha:', date);
      const appointments = this.appointments.find({
        'date.year': date.year,
        'date.month': date.month,
        'date.day': date.day
      });

      console.log('Citas encontradas:', appointments);
      return appointments;
    } catch (error) {
      console.error('Error en findByDate:', error);
      throw error;
    }
  }

  async create(appointmentData) {
    try {
      console.log('Creando nueva cita con datos:', appointmentData);
      
      // Validar que todos los campos requeridos estén presentes
      if (!appointmentData.date || 
          !appointmentData.appointmentTime ||
          !appointmentData.appointment ||
          !appointmentData.secretary) {
        throw new Error('Faltan campos requeridos');
      }

      const newId = await generateAppointmentId();
      console.log('ID generado:', newId);

      // Crear el objeto de cita siguiendo exactamente la estructura del schema
      const appointment = {
        _id: newId,
        date: {
          year: appointmentData.date.year,
          month: appointmentData.date.month,
          day: appointmentData.date.day,
          hours: appointmentData.date.hours,
          minutes: appointmentData.date.minutes,
          seconds: appointmentData.date.seconds
        },
        appointmentTime: appointmentData.appointmentTime,
        realAppointmentTime: appointmentData.appointmentTime,
        available: false,
        status: "pending",
        appointment: {
          confirmAppointment: false,
          name: appointmentData.appointment.name,
          reason: appointmentData.appointment.reason
        },
        secretary: {
          id: appointmentData.secretary.id,
          name: appointmentData.secretary.name
        },
        changeLog: []
      };

      console.log('Creando cita con estructura:', appointment);
      const newAppointment = this.appointments.create(appointment);
      console.log('Cita creada, guardando...');
      
      // Guardar la cita en la base de datos
      const savedAppointment = await newAppointment.save();
      console.log('Cita guardada exitosamente:', savedAppointment);
      
      return savedAppointment;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }
}
