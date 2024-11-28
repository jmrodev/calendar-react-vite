import { format, parse } from "@formkit/tempo";

export function standardizeDate(date) {
    // If the date is already null or undefined, return null
    if (!date) return null;

    // If the date is already a valid Date object, convert to ISO string
    if (date instanceof Date) {
        return format(date, 'YYYY-MM-DDTHH:mm:ssZ');
    }

    // If it's a string, try to parse it
    try {
        // Try parsing with multiple potential input formats
        const parsedDate = parse(date, [
            'YYYY-MM-DD',
            'YYYY-MM-DDTHH:mm:ss',
            'YYYY-MM-DDTHH:mm:ssZ',
            'MM/DD/YYYY',
            'DD/MM/YYYY'
        ]);

        // Format the parsed date to ISO 8601 standard
        return format(parsedDate, 'YYYY-MM-DDTHH:mm:ssZ');
    } catch (error) {
        // If parsing fails, return the original input or null
        console.warn('Invalid date format:', date);
        return null;
    }
}

// Example usage in UserSchema creation or update
export function preprocessUserDates(userData) {
    return {
        ...userData,
        createdAt: standardizeDate(userData.createdAt),
        lastLogin: standardizeDate(userData.lastLogin)
    };
}