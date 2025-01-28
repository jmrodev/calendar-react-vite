import { Schema } from "../config/database.js";
import { createStructuredDate } from "../Utils/date/dateUtils.js";

const UserSchema = Schema("Users", {
  _id: { type: Number, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ["admin", "secretary", "user"]
  },
  status: { 
    type: String, 
    default: 'active',
    enum: ["active", "inactive", "locked"]
  },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Object, default: null },
  lastLogin: { type: Object, default: null },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  createdAt: { 
    type: Object, 
    default: () => createStructuredDate(new Date()) 
  },
  updatedAt: { 
    type: Object, 
    default: null 
  }
});

export default UserSchema;
