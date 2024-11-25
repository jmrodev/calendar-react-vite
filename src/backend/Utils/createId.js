
// Función para generar un nuevo _id para las citas
const newId = () => {
    const allAppointments = Appointment.find();
    if (allAppointments.length === 0) return 1; // Si no hay citas, el primer _id será 1
    return Math.max(...allAppointments.map(a => a._id)) + 1;
};

// Función para generar un nuevo _id para los logs de eliminación
const newLogId = () => {
    const allLogs = DeletionLog.find();
    if (allLogs.length === 0) return 1; // Si no hay logs, el primer _id será 1
    return Math.max(...allLogs.map(log => log._id)) + 1;
};

export { newId, newLogId };