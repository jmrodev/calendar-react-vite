import { completeAppointmentService } from "../../Service/Appointment/index.js";

export const completeAppointmentController = async (req, res) => {
    try {
        
        const { appointmentId } = req.params;
        const confirmedAppointment = await confirmAppointmentService(appointmentId);
        res.status(200).json(confirmedAppointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}