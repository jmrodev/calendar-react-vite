
import { AppointmentSchema } from "../../Models/AppointmentSchema.js";

export const completeAppointmentRepository = async (appointmentId) => {
    try {
        const appointment = await AppointmentSchema.findOne(appointmentId);
        appointment.status = true;
        return await appointment.save();
    }
    catch (error) {
        throw new Error(`Error in completeAppointmentRepository: ${error.message}`);
    }
}