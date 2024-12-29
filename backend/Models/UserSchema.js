import dbLocal from "db-local";

const { Schema } = new dbLocal({ path: "../databases" });

const UserSchema = Schema("User", {
  _id: { type: Number, required: true },
  username: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "doctor", "secretary", "guest"],
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
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { 
    type: Object,
    required: false,
    default: null,
    schema: {
      year: { type: Number, required: false },
      month: { type: Number, required: false },
      day: { type: Number, required: false },
      hours: { type: Number, required: false },
      minutes: { type: Number, required: false },
      seconds: { type: Number, required: false }
    }
  },
  lastLogin: { 
    type: Object,
    required: false,
    default: null,
    schema: {
      year: { type: Number, required: false },
      month: { type: Number, required: false },
      day: { type: Number, required: false },
      hours: { type: Number, required: false },
      minutes: { type: Number, required: false },
      seconds: { type: Number, required: false }
    }
  },
  status: { type: String, default: 'active' }
});

export { UserSchema };
