import dbLocal from "db-local";
const { Schema } = new dbLocal({ path: "../../databases" });

export const loginAttemptSchema = Schema("loginAttempt", {
  username: { type: String, required: true, index: true },
  success: { type: Boolean, required: true },
  ipAddress: { type: String, required: false, default: "127.0.0.1" },
  timestamp: { type: Date, required: true },
});
