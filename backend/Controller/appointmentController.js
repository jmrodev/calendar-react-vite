import {
  createAppointmentService,
  deleteAppointmentService,
  getFilteredAppointmentsService,
  getAppointmentByIdService,
  updateAppointmentService,
  confirmAppointmentService,
  completeAppointmentService,
} from "../Service/appointmentService.js";
import { createStructuredDate } from "../Utils/date/dateUtils.js";
import { appointmentRepository } from '../Repository/appointmentRepository.js';

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

export const getAllAppointmentsController = async (req, res) => {
  try {
    const { date, status, month, year, weekDay, secretaryId } = req.query;
    
    const filters = {
      date,
      status,
      month: month ? parseInt(month) : undefined,
      year: year ? parseInt(year) : undefined,
      weekDay: weekDay ? parseInt(weekDay) : undefined,
      secretaryId: secretaryId ? parseInt(secretaryId) : undefined
    };

    const result = await getFilteredAppointmentsService(filters);
    
    res.json({
      success: true,
      data: result.data,
      filters: result.filters,
      total: result.data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAppointmentByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await getAppointmentByIdService(id);
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createAppointmentController = async (req, res) => {
  try {
    const appointmentData = req.body;
    const newAppointment = await createAppointmentService(appointmentData);
    res.status(201).json({
      success: true,
      data: newAppointment,
      message: 'Cita creada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    const secretaryId = req.user.id;

    const appointmentData = {
      ...req.body,
      status: status || req.body.status,
      secretary: {
        id: secretaryId,
        name: req.user.username
      }
    };

    const updatedAppointment = await updateAppointmentService(id, appointmentData);

    res.json({
      success: true,
      data: updatedAppointment,
      message: 'Cita actualizada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await deleteAppointmentService(id);
    res.json({
      success: true,
      data: deletedAppointment,
      message: 'Cita eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const confirmAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const confirmedAppointment = await confirmAppointmentService(id);
    res.json({
      success: true,
      data: confirmedAppointment,
      message: 'Cita confirmada exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const completeAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const completedAppointment = await completeAppointmentService(id);
    res.json({
      success: true,
      data: completedAppointment,
      message: 'Cita completada exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
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
