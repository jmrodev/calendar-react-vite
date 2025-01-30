import { Schema } from "../config/database.js";
import DateSchema from "./DateSchema.js";

const UserSchema = Schema("User", {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ["admin", "secretary", "patient"]
  },
  status: { 
    type: String, 
    default: 'active',
    enum: ["active", "inactive", "locked"]
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  // Campos específicos para secretarias
  secretaryInfo: {
    schedule: {
      startTime: { type: String },
      endTime: { type: String },
      workDays: [{ type: String }]
    },
    appointmentsManaged: [{ type: Number, ref: 'Appointments' }]
  },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: DateSchema,
  lastLogin: DateSchema,
  createdAt: DateSchema,
  updatedAt: DateSchema
});

export default UserSchema;
