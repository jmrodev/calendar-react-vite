import { LogSchema } from "../Models/LogSchema.js";
import { newLogId } from "../Utils/id/log.js";
import { v4 as uuidv4 } from 'uuid';

export const createLog = async (logData) => {
  try {
    const log = await LogSchema.create({
      _id: uuidv4(),
      ...logData,
      date: new Date(),
      timestamp: Date.now()
    }).save();

    return log;
  } catch (error) {
    throw new Error(`Error al crear log: ${error.message}`);
  }
};

export const getLogsByEntityId = async (entityId, entityType, filters = {}) => {
  try {
    const { startDate, endDate, action } = filters;
    let query = { entityId, entityType };

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate).getTime(),
        $lte: new Date(endDate).getTime()
      };
    }

    if (action) {
      query.action = action;
    }

    const logs = await LogSchema.find(query).sort({ timestamp: -1 });
    return logs;
  } catch (error) {
    throw new Error(`Error al obtener logs: ${error.message}`);
  }
};

export const getLogsByUser = async (userId, filters = {}) => {
  try {
    const { startDate, endDate, entityType, action } = filters;
    let query = { userId };

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate).getTime(),
        $lte: new Date(endDate).getTime()
      };
    }

    if (entityType) query.entityType = entityType;
    if (action) query.action = action;

    const logs = await LogSchema.find(query).sort({ timestamp: -1 });
    return logs;
  } catch (error) {
    throw new Error(`Error al obtener logs del usuario: ${error.message}`);
  }
}; 