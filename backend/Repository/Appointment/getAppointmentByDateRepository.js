import { AppointmentSchema } from '../../Models/AppointmentSchema.js';
import { standardizeDate } from '../../Utils/date/dateUtils.js';

export const getAppointmentByDateRepository = async (date) => {
    try {
        // Extensive logging
        console.log('RAW date input:', date);
        console.log('Type of date:', typeof date);

        // Standardize the date
        const standardizedDate = standardizeDate(date);
        
        // More logging
        console.log('Standardized date:', standardizedDate);

        // Validate standardized date
        if (!standardizedDate) {
            console.error('Invalid date after standardization:', date);
            throw new Error('Invalid date format');
        }

        // Perform the query
        const appointments = await AppointmentSchema.find({
            date: standardizedDate,
        });

        console.log('Appointments found:', appointments);
        
        return appointments;
    } catch (error) {
        // Comprehensive error logging
        console.error('Repository Error:', {
            message: error.message,
            stack: error.stack,
            originalDate: date
        });
        throw error;
    }
};