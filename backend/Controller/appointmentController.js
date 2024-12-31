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
import {
  standardizeDate,
  formatDate,
  createStructuredDate,
  compareDates,
  isDateLocked,
} from "../Utils/date/dateUtils.js";
import { findAppointment } from "../Utils/appointment/findAppointment.js";
import jwt from "jsonwebtoken";

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
  try {
    const { date, appointmentTime, appointment } = req.body;

    if (
      !date ||
      !appointmentTime ||
      !appointment ||
      !appointment.name ||
      !appointment.reason
    ) {
      return res.status(400).json({
        error: "Datos incompletos",
        message: "Todos los campos son requeridos",
      });
    }

    const secretaryId = req.user.id;
    const secretaryName = req.user.username;

    const structuredDate = date;

    try {
        const existingAppointment = await findAppointment({
        date: structuredDate,
        appointmentTime,
      });

      if (existingAppointment) {
        return res.status(400).json({
          error: "Cita duplicada",
          message: "Ya existe una cita programada para esta fecha y hora"
        });
      }

      const appointmentData = {
        date: structuredDate,
        appointmentTime,
        realAppointmentTime: appointmentTime,
        available: false,
        status: "pending",
        appointment: {
          confirmAppointment: false,
          name: appointment.name,
          reason: appointment.reason,
        },
      };

          const newAppointment = await createAppointmentService(
        appointmentData,
        secretaryId,
        secretaryName
      );

      return res.status(201).json(newAppointment);
    } catch (findError) {
      console.error("Error al buscar/crear cita:", findError);
      return res.status(400).json({
        error: "Error de validación",
        message: findError.message,
        details: findError.stack,
      });
    }
  } catch (error) {
    console.error("Error completo al crear cita:", error);
    return res.status(500).json({
      error: "Error del servidor",
      message: error.message,
      stack: error.stack,
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
    const appointments = await getAllAppointmentsService();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const secretaryId = req.user.id;

    const updatedAppointment = await updateAppointmentService(
      id,
      req.body,
      secretaryId
    );
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
    const decoded = verifyToken(req);
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: error.message,
    });
  }
};
