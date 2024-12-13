import { completeAppointmentRepository } from "../../Repository/Appointment/index.js";

export const completeAppointmentService = async (appointmentId) => {
    try {
        return await completeAppointmentRepository(appointmentId);
    } catch (error) {
        throw new Error(`Error in confirm appointment service: ${error.message
            }`);
    }
}