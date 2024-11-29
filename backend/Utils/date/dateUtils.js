import { format, parse } from "@formkit/tempo";

export function standardizeDate(date) {
    
    if (!date) return null;

    
    if (date instanceof Date) {
        return format(date, 'YYYY-MM-DDTHH:mm:ssZ');
    }

    try {
        
        const parsedDate = parse(date, [
            'YYYY-MM-DD',
            'YYYY-MM-DDTHH:mm:ss',
            'YYYY-MM-DDTHH:mm:ssZ',
            'MM/DD/YYYY',
            'DD/MM/YYYY'
        ]);

        
        return format(parsedDate, 'YYYY-MM-DDTHH:mm:ssZ');
    } catch (error) {
        
        console.warn('Invalid date format:', date);
        return null;
    }
}


export function preprocessUserDates(userData) {
    return {
        ...userData,
        createdAt: standardizeDate(userData.createdAt),
        lastLogin: standardizeDate(userData.lastLogin)
    };
}