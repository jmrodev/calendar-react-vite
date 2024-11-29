import { AppointmentSchema } from "../../Models/AppointmentSchema.js";

export const newAppointmentId = () => {
    const allAppointments = AppointmentSchema.find();
    if (allAppointments.length === 0) return 1; 
    return Math.max(...allAppointments.map(a => a._id)) + 1;
};