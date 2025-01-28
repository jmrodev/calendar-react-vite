import { Schema } from "../config/database.js";

const DateSchema = Schema("Dates", {
  year: { type: Number, required: true },
  month: { type: Number, required: true }, // 0-11
  day: { type: Number, required: true }, // 1-31
  hours: { type: Number, required: true }, // 0-23
  minutes: { type: Number, required: true }, // 0-59
  seconds: { type: Number, required: true }, // 0-59
});

export default DateSchema; 