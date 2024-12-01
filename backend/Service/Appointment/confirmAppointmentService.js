import { confirmAppointmentRepository } from "../../Repository/Appointment/index.js";

export const confirmAppointmentService = async (appointmentId) => {
    try {
        return await confirmAppointmentRepository(appointmentId);
    } catch (error) {
        throw new Error(`Error in confirm appointment service: ${error.message}`);
    }
}