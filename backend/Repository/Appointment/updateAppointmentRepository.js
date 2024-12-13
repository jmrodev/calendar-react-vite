import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export const updateAppointmentRepository = async (id, appointment) => { 
    console.log('updateAppointmentRepository', id);
    
    try {
        const numericId = Number(id);
        const existingAppointments = await AppointmentSchema.findOne({ _id: numericId });
        
        console.log('existingAppointments', existingAppointments);
        if (!existingAppointments) {
            throw new Error('Appointment not found');
        }

        const updatedAppointment = await AppointmentSchema.update(
            { _id: numericId },
            appointment
        );

        console.log('updatedAppointment', updatedAppointment);

        return updatedAppointment.save();
    } catch (error) {
        console.error('Update Error:', error);
        throw new Error(`Error in editAppointmentRepository: ${error.message}`);
    }
}