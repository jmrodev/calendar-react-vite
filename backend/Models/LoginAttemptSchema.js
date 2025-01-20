import dbLocal from "db-local";
const { Schema } = new dbLocal({ path: "../../databases" });

const LoginAttemptSchema = Schema("LoginAttempt", {
  _id: { type: Number, required: true },
  username: { type: String, required: true },
  success: { type: Boolean, required: true },
  timestamp: { 
    type: Object,
    required: true,
    schema: {
      year: { type: Number, required: true },
      month: { type: Number, required: true },
      day: { type: Number, required: true },
      hours: { type: Number, required: true },
      minutes: { type: Number, required: true },
      seconds: { type: Number, required: true }
    }
  },
  ip: { type: String },
  userAgent: { type: String }
});

export { LoginAttemptSchema }; 