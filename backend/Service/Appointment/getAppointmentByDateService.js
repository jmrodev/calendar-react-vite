import { getAppointmentByDateRepository } from '../../Repository/Appointment/index.js';

export const getAppointmentByDateService = async (date) => {
    try {
        const appointments = await getAppointmentByDateRepository(date);
        // if (!appointments.length) {
        //     return { status: 404, data: { message: 'No se encontraron citas para esta fecha' } };
        // }
        return { status: 200, data: appointments };
    } catch (error) {
        return { status: 500, data: { message: error.message } };
    }
};

