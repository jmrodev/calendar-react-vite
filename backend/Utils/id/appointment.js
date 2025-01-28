import { AppointmentSchema } from "../../Models/AppointmentSchema.js";

let lastId = 0;

export const generateAppointmentId = async () => {
  try {
    // Obtener todas las citas
    const appointments = await AppointmentSchema.find();
    
    // Si hay citas, encontrar el ID más alto
    if (appointments && appointments.length > 0) {
      lastId = Math.max(...appointments.map(a => a._id || 0));
    }
    
    // Incrementar el último ID
    lastId += 1;
    
    console.log('Generando nuevo ID:', lastId);
    return lastId;
  } catch (error) {
    console.error('Error generando ID:', error);
    throw new Error('Error al generar ID para la cita');
  }
};
