class AppointmentService {
    constructor() {
        this.baseUrl = 'http://localhost:3001/api';
    }

    async getAllAppointments() {
        try {
            const response = await fetch(`${this.baseUrl}/appointments`);
            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }
            return await response.json();
        } catch (error) {
            throw new Error(`Error getting appointments: ${error.message}`);
        }
    }

    async getAppointmentsByDate(date) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments/date/${date}`);
            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }
            return await response.json();
        } catch (error) {
            throw new Error(`Error getting appointments: ${error.message}`);
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
                throw new Error(error.error || 'Failed to create appointment');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error creating appointment: ${error.message}`);
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
                    error: `Server error: ${response.status}`
                }));
                throw new Error(errorData.error || 'Failed to delete appointment');
            }

            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.message };
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
                throw new Error(error.error || 'Failed to update appointment');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error updating appointment: ${error.message}`);
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
                throw new Error(error.error || 'Failed to confirm appointment');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error confirming appointment: ${error.message}`);
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
                throw new Error(error.error || 'Failed to complete appointment');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error completing appointment: ${error.message}`);
        }
    }
}

export default new AppointmentService();