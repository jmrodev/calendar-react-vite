import { AppointmentSchema } from '../Models/AppointmentSchema.js';
import { DeletionLogSchema } from '../Models/LogSchema.js';
import { newUserId, newLogId } from '../Utils/createId.js';

export const createAppointment = async (req, res) => {
    try {
        const { date, appointmentTime, realAppointmentTime, available, appointment } = req.body;

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
        // if (req.user.role === 'user') {
        //     const morningTime = '09:00'; // Define tu horario de mañana
        //     const afternoonTime = '15:00'; // Define tu horario de tarde
        //     if (appointmentTime !== morningTime && appointmentTime !== afternoonTime) {
        //         return res.status(400).json({ error: 'Invalid appointment time for user role.' });
        //     }
        // }

        const existingAppointment = await AppointmentSchema.findOne({ date, appointmentTime });
        if (existingAppointment) {
            return res.status(400).json({ error: 'The selected date and time are already booked.' });
        }

        const newAppointment = AppointmentSchema.create({
            _id: newUserId(), 
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

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await AppointmentSchema.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await AppointmentSchema.find({ _id: Number(id) });

        if (!appointment || appointment.length === 0) {
            return res.status(404).json({ error: 'AppointmentSchema not found' });
        }

        res.json(appointment[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await AppointmentSchema.find({ _id: Number(id) })[0];

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'AppointmentSchema not found'
            });
        }

        const logId = newLogId();
        const logEntry = DeletionLogSchema.create({
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
        await appointment.remove();
        res.json({
            success: true,
            message: 'AppointmentSchema cancelled and logged successfully'
        });
    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
};

export const getAppointmentsByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const appointments = await AppointmentSchema.find({ date });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const confirmAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { confirmAppointment } = req.body; 

        const appointment = await AppointmentSchema.find({ _id: Number(id) });

        if (!appointment || appointment.length === 0) {
            return res.status(404).json({ error: 'AppointmentSchema not found' });
        }

        appointment[0].appointment.confirmAppointment = confirmAppointment; 

        await appointment[0].save(); 

        res.json({ message: 'AppointmentSchema confirmed successfully', appointment: appointment[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await AppointmentSchema.find({ _id: Number(id) });

        if (!appointment || appointment.length === 0) {
            return res.status(404).json({ error: 'AppointmentSchema not found' });
        }

        appointment[0].status = 'completed';
        await appointment[0].save();

        res.json({ message: 'AppointmentSchema marked as completed', appointment: appointment[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
