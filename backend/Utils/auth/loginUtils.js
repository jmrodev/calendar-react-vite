import { createStructuredDate } from "../date/dateUtils.js";

export const handleLoginAttempts = async (user) => {
  try {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    
    if (user.loginAttempts >= 3) {
      // Bloquear por 30 minutos
      const lockDate = new Date(Date.now() + 30 * 60 * 1000);
      user.lockUntil = createStructuredDate(lockDate);
    }
    
    await user.save();
  } catch (error) {
    throw new Error(`Error handling login attempts: ${error.message}`);
  }
};
