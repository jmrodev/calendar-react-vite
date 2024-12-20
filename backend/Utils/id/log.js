import { LogSchema } from "../../Models/LogSchema.js";

export const newLogId = () => {
  const allLogs = LogSchema.find();
  if (allLogs.length === 0) return 1;
  return Math.max(...allLogs.map(log => log._id)) + 1;
};
