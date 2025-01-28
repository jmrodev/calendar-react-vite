import { Schema } from "db-local";
import UserSchema from "../Models/UserSchema.js";

export class UserRepository {
  constructor() {
    this.users = UserSchema;
  }

  async create(userData) {
    try {
      const user = await this.users.create(userData).save();
      return this._sanitizeUser(user);
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const user = await this.users.findOne({ _id: Number(id) });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      Object.assign(user, updateData);
      await user.save();
      
      return this._sanitizeUser(user);
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const user = await this.users.findOne({ _id: Number(id) });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      await user.remove();
      return this._sanitizeUser(user);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  async getAll(filters = {}) {
    try {
      const { role, status, search, pagination } = filters;
      let query = {};
      
      // Aplicar filtros
      if (role) query.role = role;
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { username: { $regex: search, $options: 'i' } },
          { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
          { 'personalInfo.lastName': { $regex: search, $options: 'i' } }
        ];
      }

      // Calcular paginación
      const skip = pagination ? (pagination.page - 1) * pagination.limit : 0;
      const limit = pagination?.limit || 10;
      
      // Obtener total de documentos
      const total = await this.users.find(query).length;
      
      // Obtener usuarios paginados
      const users = await this.users.find(query)
        .skip(skip)
        .limit(limit);

      return {
        users: users.map(this._sanitizeUser),
        total,
        page: pagination?.page || 1,
        limit
      };
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const user = await this.users.findOne({ _id: Number(id) });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      return this._sanitizeUser(user);
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  async findByUsername(username) {
    try {
      const user = await this.users.findOne({ username });
      return user ? this._sanitizeUser(user) : null;
    } catch (error) {
      throw new Error(`Error al buscar usuario por username: ${error.message}`);
    }
  }

  // Método privado para sanitizar datos del usuario
  _sanitizeUser(user) {
    if (!user) return null;
    
    const sanitized = { ...user };
    delete sanitized.password;
    delete sanitized.loginAttempts;
    delete sanitized.lockUntil;
    
    return sanitized;
  }
}

export const userRepository = new UserRepository();
