import { getAppointmentByDateService } from '../../Service/Appointment/index.js';

export const getAppointmentByDateController = async (req, res) => {
    try {
        const { date } = req.params;
        const { status, data } = await getAppointmentByDateService(date);
        console.log('datecontroller date', date);
        console.log('datacontroller data', data);
        
        res.status(status).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

