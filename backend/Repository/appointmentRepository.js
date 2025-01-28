import AppointmentSchema from "../Models/AppointmentSchema.js";
import { createStructuredDate } from "../Utils/date/dateUtils.js";

export class AppointmentRepository {
  constructor() {
    this.appointments = AppointmentSchema;
  }

  async create(appointmentData) {
    try {
      const appointment = await this.appointments.create({
        ...appointmentData,
        status: 'pending',
        createdAt: createStructuredDate(new Date())
      }).save();
      
      return appointment;
    } catch (error) {
      throw new Error(`Error al crear cita: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const appointment = await this.appointments.findOne({ _id: Number(id) });
      if (!appointment) {
        throw new Error("Cita no encontrada");
      }

      Object.assign(appointment, {
        ...updateData,
        updatedAt: createStructuredDate(new Date())
      });
      await appointment.save();
      
      return appointment;
    } catch (error) {
      throw new Error(`Error al actualizar cita: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const appointment = await this.appointments.findOne({ _id: Number(id) });
      if (!appointment) {
        throw new Error("Cita no encontrada");
      }
      await appointment.remove();
      return appointment;
    } catch (error) {
      throw new Error(`Error al eliminar cita: ${error.message}`);
    }
  }

  async findByFilters(filters = {}) {
    try {
      const { status, date, userId, search, pagination } = filters;
      let query = {};
      
      if (status) query.status = status;
      if (date) query.date = date;
      if (userId) query.userId = Number(userId);
      if (search) {
        query.$or = [
          { 'patientName': { $regex: search, $options: 'i' } },
          { 'notes': { $regex: search, $options: 'i' } }
        ];
      }

      const skip = pagination ? (pagination.page - 1) * pagination.limit : 0;
      const limit = pagination?.limit || 10;
      
      const total = await this.appointments.find(query).length;
      const appointments = await this.appointments.find(query)
        .skip(skip)
        .limit(limit);

      return {
        appointments,
        total,
        page: pagination?.page || 1,
        limit
      };
    } catch (error) {
      throw new Error(`Error al buscar citas: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const appointment = await this.appointments.findOne({ _id: Number(id) });
      if (!appointment) {
        throw new Error("Cita no encontrada");
      }
      return appointment;
    } catch (error) {
      throw new Error(`Error al obtener cita: ${error.message}`);
    }
  }

  async findByDate(date) {
    try {
      return await this.appointments.find({ date });
    } catch (error) {
      throw new Error(`Error al buscar citas por fecha: ${error.message}`);
    }
  }

  async findByMonth(year, month) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      return await this.appointments.find(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= startDate && appointmentDate <= endDate;
      });
    } catch (error) {
      throw new Error(`Error al buscar citas por mes: ${error.message}`);
    }
  }

  async confirmAppointment(id) {
    try {
      return await this.update(id, { 
        status: 'confirmed',
        confirmedAt: createStructuredDate(new Date())
      });
    } catch (error) {
      throw new Error(`Error al confirmar cita: ${error.message}`);
    }
  }

  async completeAppointment(id) {
    try {
      return await this.update(id, { 
        status: 'completed',
        completedAt: createStructuredDate(new Date())
      });
    } catch (error) {
      throw new Error(`Error al completar cita: ${error.message}`);
    }
  }
}

export const appointmentRepository = new AppointmentRepository();
