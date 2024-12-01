import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export const confirmAppointmentRepository = async (appointmentId) => {
    try {
        const appointment = await AppointmentSchema.findOne(appointmentId);
        appointment.appointment.confirmAppointment = true;
        return await appointment.save();
    }
    catch (error) {
        throw new Error(`Error in confirmAppointmentRepository: ${error.message}`);
    }
}

