import { _getHeaders, _handleError, baseUrl } from './utils';

export const completeAppointment = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/appointments/complete/${id}`, {
            method: 'PUT',
            headers: _getHeaders(),
            body: JSON.stringify({ completed: true })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Error al completar la cita');
        }

        return await response.json();
    } catch (error) {
        _handleError('completeAppointment', error);
    }
}; 