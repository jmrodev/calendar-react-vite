import { findUserByUsername } from "./findUserByName.js";
import { hashPassword } from "../auth/hashPassword.js";
import { newUserId } from "../id/user.js";
import UserSchema from "../../Models/UserSchema.js";
import { standardizeDate, createStructuredDate } from "../date/dateUtils.js";

export const createUser = async (username, password, role) => {
  try {
    if (!username || !password || !role) {
      throw new Error("Error en createUser: Todos los campos son requeridos");
    }

    if (password.length < 8) {
      throw new Error(
        "Error en createUser: La contraseña debe tener al menos 8 caracteres"
      );
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      throw new Error("Error en createUser: El usuario ya existe");
    }

    const validRoles = ["admin", "doctor", "secretary", "guest"];
    if (!validRoles.includes(role)) {
      throw new Error("Error en createUser: Rol inválido");
    }

    // Crear información personal por defecto
    const defaultPersonalInfo = {
      firstName: username,
      lastName: "",
      email: "",
      phone: ""
    };

    const currentDate = createStructuredDate(new Date());

    const userData = {
      _id: newUserId(),
      username,
      password,
      role,
      personalInfo: defaultPersonalInfo,
      loginAttempts: 0,
      lockUntil: currentDate,
      lastLogin: currentDate,
      createdAt: currentDate,
      status: 'active'
    };

    const hashedData = await hashPassword(userData);
    const newUser = await UserSchema.create(hashedData).save();
    return newUser;
  } catch (error) {
    console.error('Error completo en createUser:', error);
    throw new Error(`Error en createUser: ${error.message}`);
  }
};
