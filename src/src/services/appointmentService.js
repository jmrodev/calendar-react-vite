// appointmentService.js
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

    async deleteAppointment(date, time) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments/${date}/${time}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete appointment');
            }

            return true;
        } catch (error) {
            throw new Error(`Error deleting appointment: ${error.message}`);
        }
    }
}

export default AppointmentService;