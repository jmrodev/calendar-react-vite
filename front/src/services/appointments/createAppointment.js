import { _getHeaders, _handleError, baseUrl } from './utils';

export const createAppointment = async (appointment) => {
    try {
        const response = await fetch(`${baseUrl}/appointments`, {
            method: 'POST',
            headers: _getHeaders(),
            body: JSON.stringify(appointment)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear la cita');
        }

        return await response.json();
    } catch (error) {
        _handleError('createAppointment', error);
    }
}; 