import { getConfirmedAppointmentsRepository } from "../../Repository/Appointment/index.js";

export const getConfirmedAppointmentsService = async () => {
    try {
        return await getConfirmedAppointmentsRepository();
    } catch (error) {
        throw new Error(`Error in get confirmed appointments service: ${error.message}`);
    }
}
