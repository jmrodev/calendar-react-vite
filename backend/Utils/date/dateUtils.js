import { format, parse } from "@formkit/tempo";

export function standardizeDate(date) {
    if (date === null || date === undefined) {
        return null;
    }
    const dateString = String(date).trim();
    try {
        const directParse = new Date(dateString);
        if (!isNaN(directParse.getTime())) {
            return directParse.toISOString().split('T')[0];
        }
        const tempoParse = parse(dateString, [
            'YYYY-MM-DD',
            'YYYY-MM-DDTHH:mm:ss',
            'YYYY-MM-DDTHH:mm:ssZ',
            'MM/DD/YYYY',
            'DD/MM/YYYY'
        ]);

        if (tempoParse) {
            const formattedDate = format(tempoParse, 'YYYY-MM-DD');
            console.log('STANDARDIZE DATE - Formatted Date:', formattedDate);
            return formattedDate;
        }

        console.error('STANDARDIZE DATE: All parsing methods failed');
        return null;

    } catch (error) {
        console.error('STANDARDIZE DATE - Error:', {
            message: error.message,
            stack: error.stack,
            inputDate: date
        });
        return null;
    }
}