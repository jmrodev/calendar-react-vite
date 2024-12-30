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
  if (!date) return '';
  
  try {
    if (typeof date === 'object' && !date instanceof Date) {
      // Si es un objeto estructurado
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
      return '';
    }

    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
}

export const createStructuredDate = (dateString) => {
  try {
    // Si es una fecha ISO
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
      };
    }

    // Si es un objeto de fecha estructurado
    if (typeof dateString === 'object' && dateString !== null) {
      return {
        year: parseInt(dateString.year),
        month: parseInt(dateString.month),
        day: parseInt(dateString.day),
        hours: parseInt(dateString.hours || 0),
        minutes: parseInt(dateString.minutes || 0),
        seconds: parseInt(dateString.seconds || 0)
      };
    }

    throw new Error('Formato de fecha inválido');
  } catch (error) {
    console.error('Error en createStructuredDate:', error);
    return null;
  }
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
    console.error('Error en compareStructuredDates:', error);
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

// Función auxiliar para convertir fecha a ISO string
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
