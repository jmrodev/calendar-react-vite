import { AppointmentSchema } from "../Models/AppointmentSchema.js";
import { createStructuredDate, standardizeDate } from "../Utils/date/dateUtils.js";

export class AppointmentRepository {
  constructor() {
    this.appointments = AppointmentSchema;
  }

  async findByFilters(filters = {}) {
    try {
      const { date, status, month, year, weekDay, secretaryId } = filters;

      if (date) {
        const [y, m, d] = date.split('-').map(Number);
        return await this.appointments.find(apt => 
          apt.date.year === y &&
          apt.date.month === m - 1 && // Ajustar mes a base 0
          apt.date.day === d
        );
      }

      if (status) {
        return await this.appointments.find(apt => apt.status === status);
      }

      if (month && year) {
        return await this.appointments.find(apt => 
          apt.date.year === parseInt(year) &&
          apt.date.month === parseInt(month) - 1
        );
      }

      if (weekDay !== undefined) {
        const allAppointments = await this.appointments.find();
        return allAppointments.filter(apt => {
          const date = standardizeDate(apt.date);
          return date && date.getDay() === parseInt(weekDay);
        }).sort((a, b) => {
          const dateA = standardizeDate(a.date);
          const dateB = standardizeDate(b.date);
          return dateA - dateB || a.appointmentTime.localeCompare(b.appointmentTime);
        });
      }

      if (secretaryId) {
        return await this.appointments.find(apt => 
          apt.secretary.id === parseInt(secretaryId)
        );
      }

      return await this.appointments.find();
    } catch (error) {
      console.error('Error en findByFilters:', error);
      throw new Error(`Error al filtrar citas: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const appointment = await this.appointments.findOne({ _id: Number(id) });
      if (!appointment) throw new Error("Cita no encontrada");
      return appointment;
    } catch (error) {
      throw new Error(`Error al obtener cita: ${error.message}`);
    }
  }

  async create(appointmentData) {
    try {
      return await this.appointments.create(appointmentData).save();
    } catch (error) {
      throw new Error(`Error al crear cita: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      const appointment = await this.findById(id);
      Object.assign(appointment, data);
      return await appointment.save();
    } catch (error) {
      throw new Error(`Error al actualizar cita: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const appointment = await this.findById(id);
      await appointment.remove();
      return appointment;
    } catch (error) {
      throw new Error(`Error al eliminar cita: ${error.message}`);
    }
  }

  async confirmAppointment(id) {
    try {
      const appointment = await this.findById(id);
      appointment.appointment.confirmAppointment = true;
      return await appointment.save();
    } catch (error) {
      throw new Error(`Error al confirmar cita: ${error.message}`);
    }
  }

  async completeAppointment(id) {
    try {
      const appointment = await this.findById(id);
      appointment.status = "completed";
      return await appointment.save();
    } catch (error) {
      throw new Error(`Error al completar cita: ${error.message}`);
    }
  }
}

// Exportar una instancia única del repositorio
export const appointmentRepository = new AppointmentRepository();
