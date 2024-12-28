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
      phone: { type: String, required: false },
    },
  },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: String, default: "" },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(),
    set: (value) => new Date(value),
  },
  lastLogin: {
    type: Date,
    required: true,
    default: () => new Date(),
    set: (value) => new Date(value),
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "suspended"],
  },
});

export { UserSchema };
