import bcrypt from 'bcrypt';
import { UserSchema } from '../Models/UserSchema.js';
import { standardizeDate } from './dateUtils.js';
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { error: 'Demasiados intentos de inicio de sesión. Por favor, inténtelo más tarde.' }
  });


export async function verifyPassword(user, password) {

    if (user.lockUntil && user.lockUntil > standardizeDate(new Date(Date.now()))) {
        throw new Error('Cuenta bloqueada temporalmente');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        if (user.loginAttempts >= 5) {
            user.lockUntil = standardizeDate(new Date(Date.now() + 15 * 60 * 1000));
        }
        user.save();
        return false;
    }


    if (user.loginAttempts > 0) {
        user.loginAttempts = 0;
        user.lockUntil = "";
        user.save();
    }

    return true;
}

export async function hashPassword(userData) {

    if (!userData.password || userData.password.startsWith('$2b$')) {
        return userData;
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return { ...userData, password: hashedPassword };
}

export async function findUserByUsername(username) {
    return await UserSchema.findOne({ username });
}

export async function createUser(userData) {
    try {
        // Validación de contraseña más robusta
        if (userData.password.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres');
        }
        // Agregar validación de complejidad de contraseña
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        // if (!passwordRegex.test(userData.password)) {
        //     throw new Error('La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales');
        // }
        let user = await UserSchema.create(userData).save();
        return user;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
}