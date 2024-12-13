import { AppointmentSchema } from '../../Models/AppointmentSchema.js';

export const updateAppointmentRepository = async (id, appointment) => { 
    console.log('updateAppointmentRepository', id);
    
    try {
        
        const existingAppointments = AppointmentSchema.findOne({ _id: id });
        
        console.log('existingAppointments', existingAppointments);
        // if (!existingAppointments || existingAppointments.length === 0) {
        //     throw new Error('Appointment not found');
        // }

        
        // const existingAppointment = existingAppointments[0];

        
        // const updatedData = {
        //     _id: id,
        //     date: appointment.date || existingAppointment.date,
        //     appointmentTime: appointment.appointmentTime || existingAppointment.appointmentTime,
        //     realAppointmentTime: appointment.realAppointmentTime || existingAppointment.realAppointmentTime,
        //     available: appointment.available !== undefined ? appointment.available : existingAppointment.available,
        //     status: appointment.status || existingAppointment.status,
        //     appointment: {
        //         confirmAppointment: appointment.appointment?.confirmAppointment !== undefined 
        //             ? appointment.appointment.confirmAppointment 
        //             : existingAppointment.appointment.confirmAppointment,
        //         name: appointment.appointment?.name || existingAppointment.appointment.name,
        //         reason: appointment.appointment?.reason || existingAppointment.appointment.reason
        //     }
        // };

        
        // AppointmentSchema.remove({ _id: id });

        
        // const newAppointment = AppointmentSchema.create(updatedData);

        
        // return newAppointment.save();
    } catch (error) {
        console.error('Update Error:', error);
        throw new Error(`Error in editAppointmentRepository: ${error.message}`);
    }
}