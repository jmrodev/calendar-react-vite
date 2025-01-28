import { userRepository } from "../Repository/userRepository.js";
import { hashPassword } from "../Utils/auth/hashPassword.js";
import { newUserId } from "../Utils/id/user.js";

export class UserService {
  constructor() {
    this.repository = userRepository;
  }

  async createUser(username, password, role, personalInfo) {
    try {
      // Validaciones
      if (!username || !password || !role || !personalInfo) {
        throw new Error("Todos los campos son requeridos");
      }

      const existingUser = await this.repository.findByUsername(username);
      if (existingUser) {
        throw new Error("El usuario ya existe");
      }

      if (password.length < 8) {
        throw new Error("La contraseña es demasiado corta");
      }

      // Crear objeto de usuario
      const userData = {
        _id: await newUserId(),
        username,
        password,
        role,
        personalInfo,
        status: 'active'
      };

      // Hashear contraseña y crear usuario
      const hashedUser = await hashPassword(userData);
      return await this.repository.create(hashedUser);
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  async getAllUsers(filters) {
    try {
      return await this.repository.getAll(filters);
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }
}

export const userService = new UserService();
