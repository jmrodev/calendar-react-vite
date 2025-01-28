import { LoginAttemptSchema } from "../Models/LoginAttemptSchema.js";
import { createStructuredDate } from "../Utils/date/dateUtils.js";
import { newLoginAttemptId } from "../Utils/id/loginAttempt.js";

export class AuthRepository {
  constructor() {
    this.loginAttempts = LoginAttemptSchema;
  }

  async saveLoginAttempt(username, success, ip = '', userAgent = '') {
    try {
      const loginAttempt = await this.loginAttempts.create({
        _id: await newLoginAttemptId(),
        username,
        success,
        timestamp: createStructuredDate(new Date()),
        ip,
        userAgent
      }).save();

      return loginAttempt;
    } catch (error) {
      throw new Error(`Error al guardar intento de login: ${error.message}`);
    }
  }

  async getLoginAttempts(username, minutes = 30) {
    try {
      const currentDate = new Date();
      const cutoffDate = createStructuredDate(new Date(currentDate.getTime() - minutes * 60000));

      const attempts = await this.loginAttempts.find(attempt => {
        return attempt.username === username && 
               compareStructuredDates(attempt.timestamp, cutoffDate) > 0;
      });

      return attempts;
    } catch (error) {
      throw new Error(`Error al obtener intentos de login: ${error.message}`);
    }
  }
}

export const authRepository = new AuthRepository();
