import { getAllAppointmentsService } from '../../Service/Appointment/index.js';

export const getAllAppointmentsController = async (req, res) => {
    try {        
        const appointments = await getAllAppointmentsService();
        console.log(appointments);
        
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 