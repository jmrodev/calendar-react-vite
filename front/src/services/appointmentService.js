class AppointmentService {
    constructor() {
        this.baseUrl = 'http://localhost:3001/api';
    }

    async getAllAppointments() {
        try {
            const response = await fetch(`${this.baseUrl}/appointments`);
            if (!response.ok) {
                throw new Error('Error en getAllAppointments: Error al obtener las citas');
            }
            return await response.json();
        } catch (error) {
            throw new Error(`Error en getAllAppointments: ${error.message}`);
        }
    }

    async getAppointmentsByDate(date) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments/date/${date}`);
            if (!response.ok) {
                throw new Error('Error en getAppointmentsByDate: Error al obtener las citas');
            }
            return await response.json();
        } catch (error) {
            throw new Error(`Error en getAppointmentsByDate: ${error.message}`);
        }
    }

    async createAppointment(appointment) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointment)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error en createAppointment: Error al crear la cita');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error en createAppointment: ${error.message}`);
        }
    }

    async deleteAppointment(id) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    error: `Error en deleteAppointment: Error del servidor: ${response.status}`
                }));
                throw new Error(errorData.error || 'Error en deleteAppointment: Error al eliminar la cita');
            }

            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: `Error en deleteAppointment: ${error.message}` };
        }
    }

    async updateAppointment(id, data) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error en updateAppointment: Error al actualizar la cita');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error en updateAppointment: ${error.message}`);
        }
    }

    async confirmAppointment(id, data) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments/confirm/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error en confirmAppointment: Error al confirmar la cita');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error en confirmAppointment: ${error.message}`);
        }
    }

    async completeAppointment(id) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments/complete/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error en completeAppointment: Error al completar el servicio de cita');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error en completeAppointment: ${error.message}`);
        }
    }
}

export default new AppointmentService();