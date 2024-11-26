import bcrypt from 'bcrypt';
import { UserSchema } from '../Models/UserSchema.js';

export async function verifyPassword(user, password) {
    // Verificar bloqueo
    if (user.lockUntil && user.lockUntil > Date.now()) {
        throw new Error('Cuenta bloqueada temporalmente');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        if (user.loginAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        }
        user.save();
        return false;
    }

    // Reset intentos fallidos
    if (user.loginAttempts > 0) {
        user.loginAttempts = 0;
        user.lockUntil = null;
        user.save();
    }
    
    return true;
}

export async function hashPassword(userData) {
    // Solo hashear si la contraseña no está hasheada
    if (!userData.password || userData.password.startsWith('$2b$')) {
        return userData;
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return { ...userData, password: hashedPassword };
}

export function findUserByUsername(username) {
    const users = UserSchema.find({ username });
    return users.length > 0 ? users[0] : null;
}

export function createUser(userData) {
    // En db-local, no necesitas llamar UserSchema como función
    return UserSchema.create(userData).save();
}