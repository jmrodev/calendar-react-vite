import { getAppointmentById } from '../../Service/Appointment/index.js';

export const getAppointmentByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await getAppointmentById(id);
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 