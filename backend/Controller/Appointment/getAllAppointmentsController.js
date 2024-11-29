import { getAllAppointments } from '../../Service/Appointment/getAllAppointmentsService.js';

export const getAllAppointmentsController = async (req, res) => {
    try {
        const appointments = await getAllAppointments();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 