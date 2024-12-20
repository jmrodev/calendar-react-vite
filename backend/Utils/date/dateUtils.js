import { format, parse } from "@formkit/tempo";

export function standardizeDate(date) {
  if (date === null || date === undefined) {
    return null;
  }

  if (date instanceof Date) {
    return date;
  }

  const dateString = String(date).trim();
  try {
    const directParse = new Date(dateString);
    if (!isNaN(directParse.getTime())) {
      return directParse;
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
