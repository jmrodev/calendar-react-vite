import { createAppointment } from '../../Service/Appointment/index.js';

export const createAppointmentController = async (req, res) => {
    try {
        const { date, time, patientName, description } = req.body;
        const newAppointment = await createAppointment(date, time, patientName, description);
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 