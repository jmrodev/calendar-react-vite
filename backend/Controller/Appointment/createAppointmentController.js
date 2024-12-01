import { createAppointment } from '../../Service/Appointment/index.js';

export const createAppointmentController = async (req, res) => {
    try {
        const { 
            date, 
            appointmentTime, 
            realAppointmentTime,
            available,
            appointment 
        } = req.body;
        
        const newAppointment = await createAppointment({
            date,
            appointmentTime,
            realAppointmentTime,
            available,
            appointment
        });
        
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 