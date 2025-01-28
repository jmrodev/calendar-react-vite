import { Schema } from "../config/database.js";
import { createStructuredDate } from "../Utils/date/dateUtils.js";

const LogSchema = Schema("Logs", {
  _id: { type: Number, required: true },
  timestamp: { 
    type: Object, 
    default: () => createStructuredDate(new Date()) 
  },
  userId: { type: Number, required: true },
  action: { 
    type: String, 
    required: true,
    enum: ["create", "update", "delete", "confirm", "complete", "cancel"]
  },
  entityType: { 
    type: String, 
    required: true,
    enum: ["appointment", "user", "auth"]
  },
  entityId: { type: Number, required: true },
  description: { type: String, required: true },
  details: { type: Object, default: null },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' }
});

export default LogSchema;
