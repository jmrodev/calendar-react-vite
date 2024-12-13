import { updateAppointmentService } from "../../Service/Appointment/index.js";

export const updateAppointmentController = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAppointment = await updateAppointmentService(id, req.body);
        res.json({
            success: true,
            updatedAppointment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}