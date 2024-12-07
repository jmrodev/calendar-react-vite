import { getAllAppointments } from './getAllAppointments';
import { getAppointmentsByDate } from './getAppointmentsByDate';
import { createAppointment } from './createAppointment';
import { confirmAppointment } from './confirmAppointment';
import { completeAppointment } from './completeAppointment';

export const appointmentService = {
    getAllAppointments,
    getAppointmentsByDate,
    createAppointment,
    confirmAppointment,
    completeAppointment
};

export default appointmentService; 