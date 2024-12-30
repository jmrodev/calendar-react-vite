import { createStructuredDate } from "../date/dateUtils.js";

const MAX_LOGIN_ATTEMPTS = 3;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutos en milisegundos

export const handleLoginAttempts = async (user) => {
  try {
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      // Establecer el tiempo de bloqueo
      const lockDate = new Date(Date.now() + LOCK_TIME);
      user.lockUntil = createStructuredDate(lockDate);
      await user.save();
      throw new Error(`Cuenta bloqueada temporalmente hasta ${lockDate.toLocaleString()}`);
    }

    await user.save();
  } catch (error) {
    console.error('Error en handleLoginAttempts:', error);
    throw error;
  }
};
