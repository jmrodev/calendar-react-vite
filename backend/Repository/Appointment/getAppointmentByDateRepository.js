import { AppointmentSchema } from '../../Models/AppointmentSchema.js';
import { standardizeDate } from '../../Utils/date/dateUtils.js';
export const getAppointmentByDateRepository = async (date) => {
    try {
        const appointments = await AppointmentSchema.find({
            date: standardizeDate(date),
        });
        return appointments;
    } catch (error) {
        throw new Error(error);
    }
};
