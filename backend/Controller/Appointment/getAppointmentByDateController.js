import { getAppointmentByDateService } from "../../Service/Appointment/index.js";

export const getAppointmentByDateController = async (req, res) => {
    try {
        const { date } = req.query;
        const appointments = await getAppointmentByDateService(date);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}