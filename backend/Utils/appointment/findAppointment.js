import { AppointmentSchema } from "../../Models/AppointmentSchema.js";
import { compareStructuredDates } from "../date/dateUtils.js";

export async function findAppointment({ date, appointmentTime }) {
  console.log('⭐ Iniciando validación de cita');
  console.log('Datos recibidos:', { date, appointmentTime });
  
  if (!date || !appointmentTime) {
    console.log('❌ Error: Datos incompletos', { date, appointmentTime });
    throw new Error("Fecha y hora de la cita son obligatorios");
  }

  // Validar que date sea un objeto con la estructura correcta
  if (!date.year || !date.month || !date.day) {
    console.log('❌ Error: Estructura de fecha inválida', date);
    throw new Error("La fecha debe tener una estructura válida (year, month, day)");
  }

  try {
    console.log('🔍 Buscando citas existentes...');
    const allAppointments = await AppointmentSchema.find();
    console.log(`📊 Total de citas encontradas: ${allAppointments.length}`);
    
    // Buscar una cita que coincida en fecha y hora
    const existingAppointment = allAppointments.find(apt => {
      const datesMatch = compareStructuredDates(apt.date, date) === 0;
      const timesMatch = apt.appointmentTime === appointmentTime;
      
      if (datesMatch && timesMatch) {
        console.log('⚠️ Cita duplicada encontrada:', {
          fecha: apt.date,
          hora: apt.appointmentTime,
          id: apt._id
        });
      }
      
      return datesMatch && timesMatch;
    });

    if (existingAppointment) {
      console.log('❌ Error: Cita duplicada');
      throw new Error("Ya existe una cita para esta fecha y hora");
    }

    console.log('✅ Validación exitosa: No hay citas duplicadas');
    return null;
  } catch (error) {
    console.error('❌ Error en findAppointment:', {
      mensaje: error.message,
      tipo: error.name,
      stack: error.stack
    });
    throw error;
  }
}
