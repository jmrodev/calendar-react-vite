import dbLocal from "db-local";
const { Schema } = new dbLocal({ path: "../../databases" });

const LogSchema = Schema("Log", {
  _id: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  userId: { type: Number, required: true }, // ID de la secretaria
  action: { type: String, required: true },
  entityType: { type: String, required: true }, // 'appointment', 'user', etc.
  entityId: { type: Number, required: true },
  description: { type: String, required: true },
  details: { type: Object, required: false }
});

export { LogSchema };
