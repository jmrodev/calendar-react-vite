import { format, parse } from "@formkit/tempo";

export function standardizeDate(date) {
  console.log("STANDARDIZE DATE", date);

  if (!date) {
    return null;
  }

  try {
    // Si es un objeto Date, convertirlo al formato requerido DD/MM/YYYY
    if (date instanceof Date) {
      if (isNaN(date.getTime())) {
        console.error("Invalid Date object");
        return null;
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    // Si es un string, intentar parsearlo
    const dateString = String(date).trim();
    console.log("DATE STRING", dateString);

    // Si ya está en formato D/M/YYYY o DD/MM/YYYY, devolverlo estandarizado
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }

    // Si está en formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }

    const tempoParse = parse(dateString, [
      "YYYY-MM-DD",
      "YYYY-MM-DDTHH:mm:ss",
      "YYYY-MM-DDTHH:mm:ssZ",
      "MM/DD/YYYY",
      "DD/MM/YYYY",
    ]);

    console.log("TEMPO PARSE", tempoParse);

    if (tempoParse) {
      const parsedDate = new Date(tempoParse);
      const day = String(parsedDate.getDate()).padStart(2, '0');
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const year = parsedDate.getFullYear();
      return `${day}/${month}/${year}`;
    }

    console.error("STANDARDIZE DATE: All parsing methods failed");
    return null;
  } catch (error) {
    console.error("Error in standardizeDate:", error);
    return null;
  }
}
