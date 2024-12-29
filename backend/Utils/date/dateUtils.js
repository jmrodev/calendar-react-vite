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
    // Si es una fecha ISO
    if (dateString.includes('T')) {
      const isoDate = new Date(dateString);
      if (!isNaN(isoDate.getTime())) {
        return isoDate;
      }
    }

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
      "DD/MM/YYYY",
      "D/M/YYYY"
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

// Función auxiliar para formatear fechas para visualización
export function formatDate(date, formatStr = "DD/MM/YYYY") {
  console.log("formatDate", date, formatStr);
  if (!date) return '';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date for formatting:", date);
      return '';
    }

    console.log(dateObj, formatStr);
    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
}

export const createStructuredDate = (date) => {
  if (!date) return null;
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
    hours: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds()
  };
};

export const structuredDateToDate = (structuredDate) => {
  if (!structuredDate) return null;
  
  const { year, month, day, hours, minutes, seconds } = structuredDate;
  return new Date(year, month, day, hours, minutes, seconds);
};

export const formatStructuredDate = (structuredDate) => {
  if (!structuredDate) return '';
  
  const { year, month, day, hours, minutes } = structuredDate;
  const monthStr = String(month + 1).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  
  return `${dayStr}/${monthStr}/${year} ${hoursStr}:${minutesStr}`;
};

export const compareStructuredDates = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  return date1.year === date2.year &&
         date1.month === date2.month &&
         date1.day === date2.day;
};

export const addMinutesToStructuredDate = (structuredDate, minutes) => {
  if (!structuredDate) return null;
  
  const date = structuredDateToDate(structuredDate);
  if (!date) return null;
  
  date.setMinutes(date.getMinutes() + minutes);
  return createStructuredDate(date);
};
