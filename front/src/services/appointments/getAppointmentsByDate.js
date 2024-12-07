import { _getHeaders, _handleError, baseUrl } from './utils';

export const getAppointmentsByDate = async (date) => {
    try {
        const response = await fetch(`${baseUrl}/appointments/date/${date}`, {
            headers: _getHeaders()
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener las citas por fecha');
        }
        
        return await response.json();
    } catch (error) {
        _handleError('getAppointmentsByDate', error);
    }
}; 