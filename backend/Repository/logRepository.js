import { LogSchema } from "../Models/LogSchema.js";
import { newLogId } from "../Utils/id/log.js";

export const createLog = async (logData) => {
  try {
    const log = await LogSchema.create({
      _id: newLogId(),
      ...logData,
      date: new Date()
    });
    return await log.save();
  } catch (error) {
    throw new Error(`Error creating log: ${error.message}`);
  }
};

export const getLogsByEntityId = async (entityId, entityType) => {
  try {
    return await LogSchema.find({ entityId, entityType });
  } catch (error) {
    throw new Error(`Error getting logs: ${error.message}`);
  }
}; 