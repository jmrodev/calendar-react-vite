import { LoginAttemptSchema } from "../Models/LoginAttemptSchema.js";
import { createStructuredDate } from "../Utils/date/dateUtils.js";
import { newLoginAttemptId } from "../Utils/id/loginAttempt.js";

export const saveLoginAttempt = async (username, success, ip = '', userAgent = '') => {
  try {
    const loginAttempt = await LoginAttemptSchema.create({
      _id: await newLoginAttemptId(),
      username,
      success,
      timestamp: createStructuredDate(new Date()),
      ip,
      userAgent
    }).save();

    return await loginAttempt;
  } catch (error) {
    throw new Error(`Error en saveLoginAttempt: ${error.message}`);
  }
};

export const getLoginAttempts = async (username, minutes = 30) => {
  try {
    const currentDate = new Date();
    const cutoffDate = createStructuredDate(new Date(currentDate.getTime() - minutes * 60000));

    const attempts = await LoginAttemptSchema.find({
      username,
      timestamp: { $gt: cutoffDate }
    });

    return attempts;
  } catch (error) {
    throw new Error(`Error en getLoginAttempts: ${error.message}`);
  }
};
