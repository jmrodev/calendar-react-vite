import {
  createAppointmentService,
  deleteAppointmentService,
  getAllAppointmentsService,
  getAppointmentByDateService,
  getAppointmentById,
  getConfirmedAppointmentsService,
  updateAppointmentService,
  confirmAppointmentService,
  completeAppointmentService,
  getAppointmentsByWeekDayService,
  getFilteredAppointmentsService,
} from "../Service/appointmentService.js";
import {
  standardizeDate,
  formatDate,
  createStructuredDate,
  compareDates,
  isDateLocked,
} from "../Utils/date/dateUtils.js";
import { findAppointment } from "../Utils/appointment/findAppointment.js";
import jwt from "jsonwebtoken";
import { AppointmentRepository, getAppointmentsByMonthRepository } from '../Repository/appointmentRepository.js';
import { AppointmentSchema } from '../Models/AppointmentSchema.js';

const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("No se proporcionó token de autenticación");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};

const appointmentRepository = new AppointmentRepository();

export const completeAppointmentController = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const confirmedAppointment = await completeAppointmentService(
      appointmentId
    );
    res.status(200).json(confirmedAppointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const confirmAppointmentController = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const confirmedAppointment = await confirmAppointmentService(appointmentId);
    res.status(200).json(confirmedAppointment);
  } catch (error) {
    console.error("Error en confirmAppointmentController:", error);
    res.status(400).json({ message: error.message });
  }
};

export const createAppointmentController = async (req, res) => {
  console.log('🔵 Iniciando creación de cita');
  try {
    const appointmentData = req.body;
    console.log('Datos recibidos:', { appointmentData });

    // Validar campos requeridos
    if (!appointmentData.date || !appointmentData.appointmentTime || 
        !appointmentData.appointment || !appointmentData.secretary) {
      return res.status(400).json({
        message: 'Faltan campos requeridos'
      });
    }

    // Crear la cita
    const newAppointment = await createAppointmentService(appointmentData);

    // Enviar respuesta
    res.status(201).json(newAppointment);

  } catch (error) {
    console.error('❌ Error en createAppointmentController:', error);
    res.status(500).json({
      message: 'Error al crear la cita',
      error: error.message
    });
  }
};

export const deleteAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await deleteAppointmentService(id);
    res.json({
      success: true,
      deletedAppointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllAppointmentsController = async (req, res) => {
  try {
    const filters = {
      date: req.query.date,
      status: req.query.status,
      month: req.query.month,
      year: req.query.year,
      weekDay: req.query.weekDay
    };

    const result = await getFilteredAppointmentsService(filters);
    res.json(result);
  } catch (error) {
    console.error('Error en getAllAppointmentsController:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message
    });
  }
};

export const getAppointmentByDateController = async (req, res) => {
  try {
    const structuredDate = createStructuredDate(req.params.date);
    if (!structuredDate) {
      return res.status(400).json({
        message: "Formato de fecha inválido",
        receivedDate: req.params.date,
      });
    }

    const currentDate = createStructuredDate(new Date());
    if (req.user.lockUntil && isDateLocked(currentDate, req.user.lockUntil)) {
      return res.status(403).json({
        message: "Usuario bloqueado temporalmente",
        lockUntil: formatDate(req.user.lockUntil),
      });
    }

    const result = await getAppointmentByDateService(structuredDate);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error en getAppointmentByDateController:", error);
    res.status(500).json({
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export const getAppointmentByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await getAppointmentById(id);
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConfirmedAppointmentsController = async (req, res) => {
  try {
    const confirmedAppointments = await getConfirmedAppointmentsService();
    res.status(200).json(confirmedAppointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, action } = req.query;
    const secretaryId = req.user.id;

    if (action) {
      switch (action) {
        case 'confirm':
          return await confirmAppointmentController(req, res);
        case 'complete':
          return await completeAppointmentController(req, res);
        default:
          return res.status(400).json({
            success: false,
            message: 'Acción no válida'
          });
      }
    }

    const appointmentData = {
      ...req.body,
      status: status || req.body.status
    };

    const updatedAppointment = await updateAppointmentService(
      id,
      appointmentData,
      secretaryId
    );

    res.status(200).json({
      success: true,
      message: 'Cita actualizada exitosamente',
      data: updatedAppointment
    });
  } catch (error) {
    console.error('Error en updateAppointmentController:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la cita',
      error: error.message
    });
  }
};

export const getAppointmentsByWeekDayController = async (req, res) => {
  try {
    const { dayOfWeek } = req.params;

    const dayNumber = parseInt(dayOfWeek);
    if (isNaN(dayNumber) || dayNumber < 0 || dayNumber > 6) {
      return res.status(400).json({
        error: "Bad Request",
        message: "El día de la semana debe ser un número entre 0 y 6",
      });
    }

    const appointments = await getAppointmentsByWeekDayService(dayNumber);

    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Error en getAppointmentsByWeekDayController:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

export const getAppointmentsByDate = async (req, res) => {
  try {
    const dateStr = req.params.date;
    console.log('Received date string:', dateStr);
    
    // Parsear la fecha
    const [year, month, day] = dateStr.split('-').map(Number);
    const structuredDate = {
      year,
      month: month - 1, // Convertir a base 0
      day,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
    
    console.log('Structured date:', structuredDate);
    
    const appointments = await getAppointmentByDateRepository(structuredDate);
    console.log('Found appointments:', appointments);
    res.json(appointments);
  } catch (error) {
    console.error('Error en getAppointmentsByDate:', error);
    res.status(500).json({
      message: 'Error al obtener las citas',
      error: error.message
    });
  }
};

export const getAppointmentsByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    
    // Convertir a números
    const numYear = parseInt(year);
    const numMonth = parseInt(month) - 1; // Convertir a base 0
    
    if (isNaN(numYear) || isNaN(numMonth)) {
      return res.status(400).json({
        message: 'Año o mes inválido'
      });
    }
    
    console.log('Controller: Buscando citas para:', { year: numYear, month: numMonth });
    
    // Buscar citas que coincidan con el año y mes
    const appointments = await AppointmentSchema.find(appointment => {
      return appointment.date.year === numYear && 
             appointment.date.month === numMonth;
    });
    
    console.log('Controller: Citas encontradas:', appointments.length);
    res.json(appointments);
  } catch (error) {
    console.error('Error en getAppointmentsByMonth:', error);
    res.status(500).json({
      message: 'Error al obtener las citas del mes',
      error: error.message
    });
  }
};
