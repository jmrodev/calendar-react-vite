import { Schema } from "../config/database.js";
import DateSchema from "./DateSchema.js";

const LogSchema = Schema("Log", {
  _id: { type: String, required: true },
  timestamp: DateSchema,
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
