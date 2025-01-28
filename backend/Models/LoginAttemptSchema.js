import { Schema } from "../config/database.js";
import { createStructuredDate } from "../Utils/date/dateUtils.js";

const LoginAttemptSchema = Schema("LoginAttempts", {
  _id: { type: Number, required: true },
  username: { type: String, required: true },
  success: { type: Boolean, required: true },
  timestamp: { type: Object, default: () => createStructuredDate(new Date()) },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' }
});

export default LoginAttemptSchema;