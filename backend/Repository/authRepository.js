import { loginAttemptSchema } from '../Models/loginAttempt.js';
import { standardizeDate } from '../Utils/date/dateUtils.js';

export const saveLoginAttempt = async (
    username,
    success,
    ipAddress = '127.0.0.1'
) => {
    try {
        const attemptData = {
            username,
            success,
            ipAddress,
            timestamp: standardizeDate(new Date())
        };

        const attempt = await loginAttemptSchema.create(attemptData);
        return attempt;
    } catch (error) {
        throw new Error(`Error en saveLoginAttempt: al guardar el intento de inicio de sesión: ${error.message}`);
    }
};

export const getLoginAttempts = async (username, minutes = 15) => {
    try {
        const timeLimit = new Date(Date.now() - minutes * 60 * 1000);

        const attempts = await loginAttemptSchema.find({
            username,
            timestamp: { $gte: timeLimit }
        }).sort({ timestamp: -1 });

        return attempts;
    } catch (error) {
        throw new Error(`Error en getLoginAttempts: al obtener los intentos de inicio de sesión: ${error.message}`);
    }
}; 