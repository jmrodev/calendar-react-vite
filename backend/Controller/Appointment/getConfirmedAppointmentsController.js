import {getConfirmedAppointmentsService} from '../../Service/Appointment/index.js';

export const getConfirmedAppointmentsController = async (req, res) => {
    try {
        const confirmedAppointments = await getConfirmedAppointmentsService();
        res.status(200).json(confirmedAppointments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}