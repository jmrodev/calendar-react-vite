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
import { standardizeDate, formatDate, createStructuredDate } from "../Utils/date/dateUtils.js";
import { findAppointment } from "../Utils/appointment/findAppointment.js";

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
    const { date } = req.params;    
    const structuredDate = createStructuredDate(decodeURIComponent(date));
    if (!structuredDate) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const result = await getAppointmentByDateService(structuredDate);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const { dayOfWeek } = req.params;    
    // Convertir el día de la semana en texto a número
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
        message: "Día de la semana inválido. Use: sunday, monday, tuesday, wednesday, thursday, friday, saturday" 
      });
    }

    const appointments = await getAppointmentsByWeekDayService(dayNumber);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
