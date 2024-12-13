import { AppointmentSchema } from "../../Models/AppointmentSchema.js";

export const updateAppointmentRepository = async (id, appointment) => { 
    try {
        const appointmentFind = await AppointmentSchema.find({ _id: Number(id) });
        if (!appointmentFind) {
            throw new Error('Error en deleteAppointmentRepository: Cita no encontrada para eliminar');
        }else{
            await appointmentFind.update({ _id: Number(id), appointment });
        }
        return appointmentFind;
    } catch (error) {
        throw new Error(`Error en deleteAppointmentRepository: al eliminar la cita: ${error.message}`);
    }
}

