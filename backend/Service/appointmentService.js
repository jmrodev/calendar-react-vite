import { appointmentRepository } from "../Repository/appointmentRepository.js";
import { createStructuredDate, standardizeDate } from "../Utils/date/dateUtils.js";

export class AppointmentService {
  constructor() {
    this.repository = appointmentRepository;
  }

  async getFilteredAppointments(filters) {
    try {
      const appointments = await this.repository.findByFilters(filters);
      return {
        success: true,
        data: appointments,
        filters
      };
    } catch (error) {
      throw new Error(`Error al filtrar citas: ${error.message}`);
    }
  }

  async getAppointmentById(id) {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      throw new Error(`Error al obtener cita: ${error.message}`);
    }
  }

  async createAppointment(appointmentData) {
    try {
      return await this.repository.create(appointmentData);
    } catch (error) {
      throw new Error(`Error al crear cita: ${error.message}`);
    }
  }

  async updateAppointment(id, data) {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw new Error(`Error al actualizar cita: ${error.message}`);
    }
  }

  async deleteAppointment(id) {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new Error(`Error al eliminar cita: ${error.message}`);
    }
  }

  async confirmAppointment(id) {
    try {
      return await this.repository.confirmAppointment(id);
    } catch (error) {
      throw new Error(`Error al confirmar cita: ${error.message}`);
    }
  }

  async completeAppointment(id) {
    try {
      return await this.repository.completeAppointment(id);
    } catch (error) {
      throw new Error(`Error al completar cita: ${error.message}`);
    }
  }
}

export const appointmentService = new AppointmentService();
