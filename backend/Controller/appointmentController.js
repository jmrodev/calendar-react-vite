import {
  appointmentService
} from "../Service/appointmentService.js";
import AppointmentSchema from '../Models/AppointmentSchema.js';

export const getAllAppointmentsController = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      date: req.query.date,
      userId: req.query.userId,
      search: req.query.search,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      }
    };

    const result = await appointmentService.getFilteredAppointments(filters);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Error en getAllAppointments:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAppointmentByIdController = async (req, res) => {
  try {
    const appointment = await appointmentService.getAppointmentById(req.params.id);
    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error("Error en getAppointmentById:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const createAppointmentController = async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const appointment = await appointmentService.createAppointment(appointmentData);
    res.status(201).json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error("Error en createAppointment:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };
    
    const appointment = await appointmentService.updateAppointment(id, updateData);
    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error("Error en updateAppointment:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteAppointmentController = async (req, res) => {
  try {
    await appointmentService.deleteAppointment(req.params.id);
    res.json({
      success: true,
      message: "Cita eliminada exitosamente"
    });
  } catch (error) {
    console.error("Error en deleteAppointment:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const confirmAppointmentController = async (req, res) => {
  try {
    const appointment = await appointmentService.confirmAppointment(req.params.id);
    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error("Error en confirmAppointment:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const completeAppointmentController = async (req, res) => {
  try {
    const appointment = await appointmentService.completeAppointment(req.params.id);
    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error("Error en completeAppointment:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAppointmentsByDateController = async (req, res) => {
  try {
    const { date } = req.params;
    const appointments = await appointmentService.getAppointmentsByDate(date);
    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error("Error en getAppointmentsByDate:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAppointmentsByMonthController = async (req, res) => {
  try {
    const { year, month } = req.params;
    const numYear = parseInt(year);
    const numMonth = parseInt(month);

    if (isNaN(numYear) || isNaN(numMonth) || numMonth < 1 || numMonth > 12) {
      return res.status(400).json({
        success: false,
        message: "Año o mes inválido"
      });
    }

    const appointments = await appointmentService.getAppointmentsByMonth(numYear, numMonth);
    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error("Error en getAppointmentsByMonth:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentSchema.create(req.body).save();
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentSchema.find({});
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await AppointmentSchema.findOne({ _id: req.params.id });
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const [year, month, day] = date.split('-').map(Number);
    
    const appointments = await AppointmentSchema.find(appointment => 
      appointment.date.year === year &&
      appointment.date.month === month &&
      appointment.date.day === day
    );
    
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentSchema.findOne({ _id: req.params.id });
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    
    Object.assign(appointment, req.body);
    await appointment.save();
    
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentSchema.findOne({ _id: req.params.id });
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    
    await appointment.remove();
    res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
