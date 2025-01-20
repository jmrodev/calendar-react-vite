import dbLocal from "db-local";
const { Schema } = new dbLocal({ path: "../../databases" });

const DateSchema = Schema("Date", {
  year: { type: Number, required: true },
  month: { type: Number, required: true }, // 0-11
  day: { type: Number, required: true }, // 1-31
  hours: { type: Number, required: true }, // 0-23
  minutes: { type: Number, required: true }, // 0-59
  seconds: { type: Number, required: true }, // 0-59
});

export { DateSchema }; 