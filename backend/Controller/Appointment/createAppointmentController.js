import { createAppointmentService } from '../../Service/Appointment/index.js';
import { findAppointment } from '../../Utils/appointment/findAppointment.js';
export const createAppointmentController = async (req, res) => {
    try {
        const { 
            date, 
            appointmentTime, 
            realAppointmentTime,
            available,
            appointment 
        } = req.body;

        await findAppointment({ date, appointmentTime });
        
        const newAppointment = await createAppointmentService({
            date,
            appointmentTime,
            realAppointmentTime,
            available,
            appointment
        });
        
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Error al crear cita:', error);
        res.status(400).json({ error: error.message });
    }
};