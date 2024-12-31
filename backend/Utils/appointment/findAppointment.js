import { AppointmentSchema } from "../../Models/AppointmentSchema.js";
import { compareStructuredDates } from "../date/dateUtils.js";

export async function findAppointment({ date, appointmentTime }) {
  console.log('Buscando cita para:', { 
    date: JSON.stringify(date), 
    appointmentTime 
  });
  
  if (!date || !appointmentTime) {
    throw new Error("Fecha y hora de la cita son obligatorios");
  }

  try {
    const allAppointments = await AppointmentSchema.find();
    
    // Buscar una cita que coincida en fecha y hora
    const existingAppointment = allAppointments.find(apt => {
      const datesMatch = compareStructuredDates(apt.date, date) === 0;
      const timesMatch = apt.appointmentTime === appointmentTime;
      
      if (datesMatch && timesMatch) {
        console.log('Cita encontrada:', {
          existingDate: apt.date,
          existingTime: apt.appointmentTime,
          newDate: date,
          newTime: appointmentTime
        });
      }
      
      return datesMatch && timesMatch;
    });

    if (existingAppointment) {
      throw new Error("Ya existe una cita para esta fecha y hora");
    }

    // Si no hay cita existente, retornamos null
    return null;
  } catch (error) {
    console.error('Error en findAppointment:', error);
    throw error; // Lanzar el error original, no uno nuevo
  }
}
