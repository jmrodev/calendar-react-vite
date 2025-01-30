import { Schema } from "../config/database.js";
import DateSchema from "./DateSchema.js";

const LoginAttemptSchema = Schema("LoginAttempt", {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  success: { type: Boolean, required: true },
  timestamp: DateSchema,
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' }
});

export default LoginAttemptSchema;