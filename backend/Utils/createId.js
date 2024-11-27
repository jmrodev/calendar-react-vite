import { UserSchema } from "../Models/UserSchema.js";
import { AppointmentSchema } from "../Models/AppointmentSchema.js";

const newAppointmentId = () => {
    const allAppointments = AppointmentSchema.find();
    if (allAppointments.length === 0) return 1; 
    return Math.max(...allAppointments.map(a => a._id)) + 1;
};


const newLogId = () => {
    const allLogs = DeletionLog.find();
    if (allLogs.length === 0) return 1; 
    return Math.max(...allLogs.map(log => log._id)) + 1;
};


const newUserId = () => {
    const allUsers = UserSchema.find(); 
    if (allUsers.length === 0) return 1; 
    return Math.max(...allUsers.map(user => user._id)) + 1;
};

export { newAppointmentId, newLogId, newUserId };