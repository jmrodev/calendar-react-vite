import dbLocal from "db-local";
import { createStructuredDate } from '../Utils/date/dateUtils.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.join(__dirname, '../../databases');

const { Schema } = new dbLocal({ path: dbPath });

const UserSchema = Schema("User", {
  _id: { type: Number, required: true },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "doctor", "secretary", "guest"]
  },
  personalInfo: {
    type: Object,
    required: true,
    schema: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    }
  },
  loginAttempts: { 
    type: Number, 
    default: 0 
  },
  lockUntil: { 
    type: Object,
    required: false,
    default: () => createStructuredDate(new Date()),
    schema: {
      year: { type: Number, required: true },
      month: { type: Number, required: true },
      day: { type: Number, required: true },
      hours: { type: Number, required: true },
      minutes: { type: Number, required: true },
      seconds: { type: Number, required: true }
    }
  },
  lastLogin: { 
    type: Object,
    required: false,
    default: () => createStructuredDate(new Date()),
    schema: {
      year: { type: Number, required: true },
      month: { type: Number, required: true },
      day: { type: Number, required: true },
      hours: { type: Number, required: true },
      minutes: { type: Number, required: true },
      seconds: { type: Number, required: true }
    }
  },
  status: { 
    type: String, 
    default: 'active' 
  }
});

export default UserSchema;
