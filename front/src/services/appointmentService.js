import Cookies from 'js-cookie'; // Consider using for token management

class AppointmentService {
    constructor() {
        this.baseUrl = 'http://localhost:3001/api';
    }

    // Helper method to get authentication headers
    _getHeaders() {
        const token = localStorage.getItem('jwt') || Cookies.get('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        };
    }

    // Generic error handler
    _handleError(method, error) {
        console.error(`Error in ${method}:`, error);
        throw new Error(error.message || `Error en ${method}: Ocurrió un error inesperado`);
    }

    async getAllAppointments() {
        try {
            const response = await fetch(`${this.baseUrl}/appointments`, {
                headers: this._getHeaders()
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener las citas');
            }
            
            return await response.json();
        } catch (error) {
            this._handleError('getAllAppointments', error);
        }
    }

    async getAppointmentsByDate(date) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments/date/${date}`, {
                headers: this._getHeaders()
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener las citas por fecha');
            }
            
            return await response.json();
        } catch (error) {
            this._handleError('getAppointmentsByDate', error);
        }
    }

    async createAppointment(appointment) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify(appointment)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear la cita');
            }

            return await response.json();
        } catch (error) {
            this._handleError('createAppointment', error);
        }
    }

    // Other methods remain similar, using this._getHeaders() and this._handleError()
}

export default new AppointmentService();