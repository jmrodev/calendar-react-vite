import { format, parse } from "@formkit/tempo";

export function standardizeDate(date) {
  if (!date) {
    console.error("Date is null or undefined");
    return null;
  }

  try {
    // Si ya es un objeto Date
    if (date instanceof Date) {
      if (isNaN(date.getTime())) {
        console.error("Invalid Date object");
        return null;
      }
      return date;
    }

    // Si es un string, intentar parsearlo
    const dateString = String(date).trim();
    // Si ya está en formato D/M/YYYY o DD/MM/YYYY
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      return new Date(year, month - 1, parseInt(day));
    }

    // Si está en formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(dateString);
    }

    const tempoParse = parse(dateString, [
      "YYYY-MM-DD",
      "YYYY-MM-DDTHH:mm:ss",
      "YYYY-MM-DDTHH:mm:ssZ",
      "MM/DD/YYYY",
      "DD/MM/YYYY",
    ]);

    if (tempoParse) {
      return new Date(tempoParse);
    }

    console.error("Failed to parse date:", dateString);
    return null;
  } catch (error) {
    console.error("Error in standardizeDate:", error);
    return null;
  }
}

export function formatDate(date, formatStr = "DD/MM/YYYY") {
  if (!date) return '';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date for formatting:", date);
      return '';
    }
    
    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
}

export const createStructuredDate = (date) => {
  if (!date) return null;

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return null;

  return parsedDate;
};

export const formatStructuredDate = (date) => {
  if (!date) return '';

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return '';

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return parsedDate.toLocaleDateString('es-ES', options);
};

export const getWeekDates = (date) => {
  const current = new Date(date);
  const week = [];

  // Ir al inicio de la semana (domingo)
  current.setDate(current.getDate() - current.getDay());

  for (let i = 0; i < 7; i++) {
    week.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return week;
};

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subtractDays = (date, days) => {
  return addDays(date, -days);
};

export const getMonthDates = (year, month) => {
  const dates = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

export const formatTimeSlot = (time) => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

export const isValidTimeSlot = (time) => {
  if (!time) return false;
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};
