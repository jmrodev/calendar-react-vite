import { AppointmentSchema } from '../../Models/AppointmentSchema.js';
import { standardizeDate } from '../../Utils/date/dateUtils.js';

export const getAppointmentByDateRepository = async (date) => {
    try {
        const standardizedDate = standardizeDate(date);
        
        if (!standardizedDate) {
            console.error('Invalid date after standardization:', date);
            throw new Error('Invalid date format');
        }

        
        const appointments = await AppointmentSchema.find({
            date: standardizedDate,
        });
        
        return appointments;
    } catch (error) {
        
        console.error('Repository Error:', {
            message: error.message,
            stack: error.stack,
            originalDate: date
        });
        throw error;
    }
};