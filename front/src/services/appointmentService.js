import Cookies from 'js-cookie'; 

class AppointmentService {
    constructor() {
        this.baseUrl = 'http://localhost:3001/api';
    }

    
    _getHeaders() {
        const token = localStorage.getItem('jwt') || Cookies.get('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        };
    }

    
    _handleError(method, error) {
        console.error(`Error in ${method}:`, error);
        throw new Error(error.message || `Error en ${method}: Ocurrió un error inesperado`,error);
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

    async confirmAppointment(id,data={}) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments/confirm/${id}`, {
                method: 'PUT',
                headers: this._getHeaders(),
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
            this._handleError('confirmAppointment', error);
        }
    }

    async completeAppointment(id) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments/complete/${id}`, {
                method: 'PUT',
                headers: this._getHeaders()
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Error al completar la cita');
            }

            return await response.json();
        } catch (error) {
            this._handleError('completeAppointment', error);
        }
    }
}

export default new AppointmentService();