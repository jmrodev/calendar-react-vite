import bcrypt from 'bcrypt';
import { standardizeDate } from '../date/dateUtils.js';

export async function verifyPassword(user, password) {
    if (!password || !user.password) {
        throw new Error('Password is required');
    }

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
