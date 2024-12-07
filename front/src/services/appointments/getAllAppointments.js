import { _getHeaders, _handleError, baseUrl } from './utils';

export const getAllAppointments = async () => {
    try {
        const response = await fetch(`${baseUrl}/appointments`, {
            headers: _getHeaders()
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener las citas');
        }
        
        return await response.json();
    } catch (error) {
        _handleError('getAllAppointments', error);
    }
}; 