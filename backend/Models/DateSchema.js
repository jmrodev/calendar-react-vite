import { Schema } from "../config/database.js";

const DateSchema =  Schema("Date", {
  _id: { type: String, required: true }, // Asegúrate de que _id es una cadena
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  day: { type: Number, required: true },
  hours: { type: Number, required: true },
  minutes: { type: Number, required: true },
  seconds: { type: Number, required: true }
});

export default DateSchema;