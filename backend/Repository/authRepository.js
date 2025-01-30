import { v4 as uuidv4 } from "uuid";
import LoginAttemptSchema from "../Models/LoginAttemptSchema.js";
import DateSchema from "../Models/DateSchema.js";

export class AuthRepository {
  constructor() {
    this.loginAttempts = LoginAttemptSchema;
  }

  async saveLoginAttempt(username, success, ip = "", userAgent = "") {
    
    try {
      const now = new Date();
      const timestampId = uuidv4();

      const timestamp = await DateSchema.create({
        _id: timestampId,
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      }).save;

      console.log("timestamp", timestamp);
      

      const loginAttemptId = uuidv4();

      const loginAttempt = await this.loginAttempts.create({
        _id: loginAttemptId,
        username,
        success,
        timestamp: timestamp._id,
        ip,
        userAgent,
      });

      return loginAttempt;
    } catch (error) {
      console.error("Error details:", error);
      throw new Error(`Error al guardar intento de login: ${error.message}`);
    }
  }
}

export const authRepository = new AuthRepository();
