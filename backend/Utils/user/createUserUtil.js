import { findUserByUsername } from "./findUserByName.js";
import { hashPassword } from "../auth/hashPassword.js";
import { newUserId } from "../id/user.js";
import { UserSchema } from "../../Models/UserSchema.js";
import { standardizeDate } from "../date/dateUtils.js";

export const createUser = async (username, password, role) => {
    try {
        // Validaciones
        if (!username || !password || !role) {
            throw new Error('Error en createUser: Todos los campos son requeridos');
        }
        
        if (password.length < 8) {
            throw new Error('Error en createUser: La contraseña debe tener al menos 8 caracteres');
        }

        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            throw new Error('Error en createUser: El usuario ya existe');
        }

        const validRoles = ['admin', 'user', 'staff', 'guest'];
        if (!validRoles.includes(role)) {
            throw new Error('Error en createUser: Rol inválido');
        }

        // Crear objeto de usuario
        const userData = {
            _id: await newUserId(),
            username,
            password,
            role,
            loginAttempts: 0,
            lockUntil: "",
            createdAt: standardizeDate(new Date()),
            lastLogin: standardizeDate(new Date())
        };

        // Hashear contraseña
        const hashedData = await hashPassword(userData);

        // Crear usuario
        const newUser = await UserSchema.create(hashedData);
        return newUser;
    } catch (error) {
        throw new Error(`Error en createUser: ${error.message}`);
    }
};

