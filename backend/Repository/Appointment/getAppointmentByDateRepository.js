import { AppointmentSchema } from '../../Models/AppointmentSchema.js';
import { standardizeDate } from '../../Utils/date/dateUtils.js';
export const getAppointmentByDateRepository = async (date) => {

    const foundAppointments = await AppointmentSchema.find(appointment => standardizeDate(appointment.date) == standardizeDate(date));
    
    if (foundAppointments && Array.isArray(foundAppointments)) {
        console.log("Citas encontradas:", foundAppointments);
    } else {
        console.log("No se encontraron citas para la fecha proporcionada.");
    }

};
