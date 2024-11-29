import { deleteAppointment } from '../../Service/Appointment/deleteAppointmentService.js';

export const deleteAppointmentController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAppointment = await deleteAppointment(id);
        res.json({
            success: true,
            deletedAppointment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 