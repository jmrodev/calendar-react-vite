import { _getHeaders, _handleError, baseUrl } from './utils';

export const confirmAppointment = async (id, data = {}) => {
    try {
        const response = await fetch(`${baseUrl}/appointments/confirm/${id}`, {
            method: 'PUT',
            headers: _getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Error al confirmar la cita');
        }

        const responseData = await response.json();
        console.log('confirmAppointment successful:', responseData);
        
        return responseData;
    } catch (error) {
        _handleError('confirmAppointment', error);
    }
}; 