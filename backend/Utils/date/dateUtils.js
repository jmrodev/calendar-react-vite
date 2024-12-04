import { format, parse } from "@formkit/tempo";

export function standardizeDate(date) {
    // Immediate, comprehensive logging
    console.log('STANDARDIZE DATE - Raw Input:', JSON.stringify(date));
    console.log('STANDARDIZE DATE - Input Type:', typeof date);

    // Handle null or undefined
    if (date === null || date === undefined) {
        console.log('STANDARDIZE DATE: Null or undefined input');
        return null;
    }

    // Convert to string and trim
    const dateString = String(date).trim();

    // More logging
    console.log('STANDARDIZE DATE - Trimmed String:', dateString);

    try {
        // Attempt parsing with multiple strategies
        // 1. Direct Date object parsing
        const directParse = new Date(dateString);
        if (!isNaN(directParse.getTime())) {
            console.log('STANDARDIZE DATE: Direct parse successful');
            return directParse.toISOString().split('T')[0];
        }

        // 2. Formkit tempo parsing
        const tempoParse = parse(dateString, [
            'YYYY-MM-DD',
            'YYYY-MM-DDTHH:mm:ss',
            'YYYY-MM-DDTHH:mm:ssZ',
            'MM/DD/YYYY',
            'DD/MM/YYYY'
        ]);

        // Log tempo parsing result
        console.log('STANDARDIZE DATE - Tempo Parse Result:', tempoParse);

        if (tempoParse) {
            const formattedDate = format(tempoParse, 'YYYY-MM-DD');
            console.log('STANDARDIZE DATE - Formatted Date:', formattedDate);
            return formattedDate;
        }

        // If all parsing fails
        console.error('STANDARDIZE DATE: All parsing methods failed');
        return null;

    } catch (error) {
        // Comprehensive error logging
        console.error('STANDARDIZE DATE - Error:', {
            message: error.message,
            stack: error.stack,
            inputDate: date
        });
        return null;
    }
}