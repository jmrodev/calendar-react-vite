import { format, parse } from "@formkit/tempo";

export function standardizeDate(date) {
  if (date === null || date === undefined) {
    return null;
  }
  const dateString = String(date).trim();
  try {
    const directParse = new Date(dateString);
    if (!isNaN(directParse.getTime())) {
      return formatDateToArgentinian(directParse);
    }
    const tempoParse = parse(dateString, [
      "YYYY-MM-DD",
      "YYYY-MM-DDTHH:mm:ss",
      "YYYY-MM-DDTHH:mm:ssZ",
      "MM/DD/YYYY",
      "DD/MM/YYYY",
    ]);

    if (tempoParse) {
      const formattedDate = format(tempoParse, "DD/MM/YYYY");
      console.log("STANDARDIZE DATE - Formatted Date:", formattedDate);
      return formattedDate;
    }

    console.error("STANDARDIZE DATE: All parsing methods failed");
    return null;
  } catch (error) {
    console.error("STANDARDIZE DATE - Error:", {
      message: error.message,
      stack: error.stack,
      inputDate: date,
    });
    return null;
  }
}

function formatDateToArgentinian(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
