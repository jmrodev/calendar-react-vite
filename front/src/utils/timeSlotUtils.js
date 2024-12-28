import { getAppointmentsByDate } from "../services/appointmentsService";
import { standardizeDate } from "./dateUtils";

export const generateTimeSlots = async (selectedDate) => {
  try {
    if (!selectedDate) {
      throw new Error("No se ha seleccionado una fecha");
    }

    const dateStr = standardizeDate(selectedDate);
    if (!dateStr) {
      throw new Error("Fecha inválida");
    }
    console.log("Fecha estandarizada:", dateStr);

    const existingSlots = await getAppointmentsByDate(dateStr);
    const slots = [];
    const initHour = 9;
    const finishHour = 19;

    for (let hour = initHour; hour < finishHour; hour++) {
      const timeString = `${hour.toString().padStart(2, "0")}:00`;
      const existingSlot = existingSlots.find(
        (slot) => slot.appointmentTime === timeString
      );
      if (existingSlot) {
        slots.push({
          ...existingSlot,
          id: existingSlot._id,
          _id: existingSlot._id,
        });
      } else {
        slots.push({
          _id: `${dateStr}-${timeString}`,
          id: `${dateStr}-${timeString}`,
          date: dateStr,
          appointmentTime: timeString,
          realAppointmentTime: timeString,
          available: true,
          status: "pending",
          appointment: null,
        });
      }
    }
    return slots;
  } catch (err) {
    throw new Error("Error generating time slots: " + err.message);
  }
};
