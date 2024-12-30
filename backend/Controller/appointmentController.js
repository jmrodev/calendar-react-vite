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
} from "../Service/appointmentService.js";
import { standardizeDate, formatDate, createStructuredDate, compareDates, isDateLocked } from "../Utils/date/dateUtils.js";
import { findAppointment } from "../Utils/appointment/findAppointment.js";
import jwt from 'jsonwebtoken';

const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('No se proporcionó token de autenticación');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

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
    const { appointmentId} = req.params;
    const confirmedAppointment = await confirmAppointmentService(appointmentId);
    res.status(200).json(confirmedAppointment);
  } catch (error) {
    console.error('Error en confirmAppointmentController:', error);
    res.status(400).json({ message: error.message });
  }
};

export const createAppointmentController = async (req, res) => {
  try {
    const {
      date,
      appointmentTime,
      realAppointmentTime,
      available,
      appointment,
      status
    } = req.body;

    const secretaryId = req.user.id;
    const secretaryName = req.user.username;

    const structuredDate = createStructuredDate(date);
    if (!structuredDate) {
      throw new Error("Invalid date format");
    }

    await findAppointment({ date: structuredDate, appointmentTime });
    
    const newAppointment = await createAppointmentService({
      date: structuredDate,
      appointmentTime,
      realAppointmentTime,
      available,
      status: status || "pending",
      appointment,
    }, secretaryId, secretaryName);

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error al crear cita:", error);
    res.status(400).json({ error: error.message });
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
    const appointments = await getAllAppointmentsService();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentByDateController = async (req, res) => {
  try {
    console.log('User from token:', req.user);
    console.log('Date param:', req.params.date);
    console.log('Current date:', new Date().toISOString());

    const structuredDate = createStructuredDate(req.params.date);
    if (!structuredDate) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido",
        receivedDate: req.params.date 
      });
    }

    // Verificar si la fecha está bloqueada
    const currentDate = createStructuredDate(new Date());
    if (req.user.lockUntil && isDateLocked(currentDate, req.user.lockUntil)) {
      return res.status(403).json({ 
        message: "Usuario bloqueado temporalmente",
        lockUntil: formatDate(req.user.lockUntil)
      });
    }

    const result = await getAppointmentByDateService(structuredDate);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Error en getAppointmentByDateController:', error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
    const secretaryId = req.user.id;
    
    const updatedAppointment = await updateAppointmentService(id, req.body, secretaryId);
    res.json({
      success: true,
      updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentsByWeekDayController = async (req, res) => {  
  try {
    // Log para debugging
    console.log('User from token:', req.user);
    console.log('Params:', req.params);

    const { dayOfWeek } = req.params;    
    
    const weekDays = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6
    };
    
    const dayNumber = weekDays[dayOfWeek.toLowerCase()];
    
    if (dayNumber === undefined) {
      return res.status(400).json({ 
        message: "Día de la semana inválido" 
      });
    }

    const appointments = await getAppointmentsByWeekDayService(dayNumber);
    res.json(appointments);
  } catch (error) {
    console.error('Error en getAppointmentsByWeekDayController:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentsByDate = async (req, res) => {
  try {
    const decoded = verifyToken(req);
    // Resto del código...
  } catch (error) {
    return res.status(401).json({ 
      error: true, 
      message: error.message 
    });
  }
};
