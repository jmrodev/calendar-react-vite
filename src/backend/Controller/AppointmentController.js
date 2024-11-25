import { Appointment } from '../Models/AppointmentModel.js';
import { DeletionLog } from '../Models/LogModel.js';
import { newId, newLogId } from '../Utils/createId.js';

// Función para crear una nueva cita
export const createAppointment = async (req, res) => {
    try {
        const { date, appointmentTime, realAppointmentTime, available, appointment } = req.body;

        // Verificar que appointmentTime, date y appointment estén presentes
        if (!appointmentTime) {
            return res.status(400).json({ error: 'The value "appointmentTime" is required.' });
        }
        if (!date) {
            return res.status(400).json({ error: 'The value "date" is required.' });
        }
        if (!appointment) {
            return res.status(400).json({ error: 'The value "appointment" is required.' });
        }

        // Verificar si el usuario es un 'user' y limitar los horarios
        if (req.user.role === 'user') {
            const morningTime = '09:00'; // Define tu horario de mañana
            const afternoonTime = '15:00'; // Define tu horario de tarde
            if (appointmentTime !== morningTime && appointmentTime !== afternoonTime) {
                return res.status(400).json({ error: 'Invalid appointment time for user role.' });
            }
        }

        // Verificar si ya existe una cita en la misma fecha y hora
        const existingAppointment = await Appointment.findOne({ date, appointmentTime });
        if (existingAppointment) {
            return res.status(400).json({ error: 'The selected date and time are already booked.' });
        }

        const newAppointment = Appointment.create({
            _id: newId(), // Generar un nuevo ID
            date,
            appointmentTime,
            realAppointmentTime,
            available,
            appointment
        });
        const objectSaved = await newAppointment.save();

        res.status(201).json(objectSaved);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Función para obtener todas las citas
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para obtener cita por ID
export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.find({ _id: Number(id) });

        if (!appointment || appointment.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json(appointment[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para eliminar una cita
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the appointment by ID
        const appointment = await Appointment.find({ _id: Number(id) })[0];

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        // Create deletion log
        const logId = newLogId();
        const logEntry = DeletionLog.create({
            _id: logId,
            appointmentId: appointment._id,
            deletedAt: new Date().toISOString(),
            deletedData: {
                date: appointment.date,
                appointmentTime: appointment.appointmentTime,
                realAppointmentTime: appointment.realAppointmentTime,
                appointment: appointment.appointment
            }
        });

        await logEntry.save();

        // Remove the appointment
        await appointment.remove();

        res.json({
            success: true,
            message: 'Appointment cancelled and logged successfully'
        });
    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
};

// Función para obtener citas por fecha
export const getAppointmentsByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const appointments = await Appointment.find({ date });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para confirmar cita
export const confirmAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { confirmAppointment } = req.body; // Se espera que se envíe el estado de confirmación

        // Buscar la cita por ID
        const appointment = await Appointment.find({ _id: Number(id) });

        if (!appointment || appointment.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Actualizar el estado de confirmación
        appointment[0].appointment.confirmAppointment = confirmAppointment; // Cambiar a true o false según el cuerpo de la solicitud

        // Guardar los cambios en la base de datos
        await appointment[0].save(); // Guardar la cita actualizada

        res.json({ message: 'Appointment confirmed successfully', appointment: appointment[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para completar cita
export const completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.find({ _id: Number(id) });

        if (!appointment || appointment.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointment[0].status = 'completed';
        await appointment[0].save();

        res.json({ message: 'Appointment marked as completed', appointment: appointment[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
