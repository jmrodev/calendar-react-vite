import { format, parse } from "@formkit/tempo";

export const standardizeDate = (date) => {
  if (date && typeof date === "object" && "year" in date) {
    return new Date(
      date.year,
      date.month,
      date.day,
      date.hours || 0,
      date.minutes || 0,
      date.seconds || 0
    );
  }

  if (date instanceof Date) {
    return date;
  }

  if (typeof date === "string") {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  console.error("Failed to parse date:", date);
  return null;
};

export function formatDate(date, formatStr = "DD/MM/YYYY") {
  if (!date) return "";

  try {
    if (typeof date === "object" && !date instanceof Date) {
      const structuredDate = date;
      date = new Date(
        structuredDate.year,
        structuredDate.month,
        structuredDate.day,
        structuredDate.hours || 0,
        structuredDate.minutes || 0,
        structuredDate.seconds || 0
      );
    }

    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date for formatting:", date);
      return "";
    }

    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

export const createStructuredDate = (date) => {
  try {
    if (date && typeof date === "object" && "year" in date) {
      return {
        year: date.year,
        month: date.month,
        day: date.day,
        hours: date.hours || 0,
        minutes: date.minutes || 0,
        seconds: date.seconds || 0,
      };
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.error("Fecha inválida:", date);
      return null;
    }

    return {
      year: parsedDate.getFullYear(),
      month: parsedDate.getMonth(),
      day: parsedDate.getDate(),
      hours: parsedDate.getHours(),
      minutes: parsedDate.getMinutes(),
      seconds: parsedDate.getSeconds(),
    };
  } catch (error) {
    console.error("Error al crear fecha estructurada:", error);
    return null;
  }
};

export const structuredDateToDate = (structuredDate) => {
  if (!structuredDate) return null;

  const { year, month, day, hours, minutes, seconds } = structuredDate;
  return new Date(year, month, day, hours, minutes, seconds);
};

export const formatStructuredDate = (structuredDate) => {
  if (!structuredDate) return "";

  const { year, month, day, hours, minutes } = structuredDate;
  const monthStr = String(month + 1).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");

  return `${dayStr}/${monthStr}/${year} ${hoursStr}:${minutesStr}`;
};

export const compareStructuredDates = (date1, date2) => {
  if (!date1 || !date2) return -1;

  try {
    const d1 = new Date(
      date1.year,
      date1.month,
      date1.day,
      date1.hours || 0,
      date1.minutes || 0,
      date1.seconds || 0
    ).getTime();

    const d2 = new Date(
      date2.year,
      date2.month,
      date2.day,
      date2.hours || 0,
      date2.minutes || 0,
      date2.seconds || 0
    ).getTime();

    return d1 - d2;
  } catch (error) {
    console.error("Error en compareStructuredDates:", error);
    return -1;
  }
};

export const addMinutesToStructuredDate = (structuredDate, minutes) => {
  if (!structuredDate) return null;

  const date = structuredDateToDate(structuredDate);
  if (!date) return null;

  date.setMinutes(date.getMinutes() + minutes);
  return createStructuredDate(date);
};

export const compareDates = (date1, date2) => {
  if (!date1 || !date2) return false;

  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.day &&
    date1.hours === date2.hours &&
    date1.minutes === date2.minutes
  );
};

export const isDateLocked = (currentDate, lockUntil) => {
  if (!lockUntil) return false;

  const current = new Date(
    currentDate.year,
    currentDate.month,
    currentDate.day,
    currentDate.hours,
    currentDate.minutes,
    currentDate.seconds
  );

  const lock = new Date(
    lockUntil.year,
    lockUntil.month,
    lockUntil.day,
    lockUntil.hours,
    lockUntil.minutes,
    lockUntil.seconds
  );

  return current < lock;
};

export const toISOString = (structuredDate) => {
  if (!structuredDate) return null;

  const date = new Date(
    structuredDate.year,
    structuredDate.month,
    structuredDate.day,
    structuredDate.hours || 0,
    structuredDate.minutes || 0,
    structuredDate.seconds || 0
  );

  return date.toISOString();
};
