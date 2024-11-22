import express from 'express';
import cors from 'cors';
import dbLocal from 'db-local';
const { Schema } = new dbLocal({ path: "./databases" });

const app = express();
app.use(cors());
app.use(express.json());

// Define el esquema para las citas
const Appointment = Schema("Appointment", {
    _id: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    available: { type: Boolean, required: true },
    appointment: {
        type: Object,
        required: true,
        schema: {
            name: { type: String, required: true },
            reason: { type: String, required: true }
        }
    }
});

// Define el esquema para los logs de eliminaciones
const DeletionLog = Schema("DeletionLog", {
    _id: { type: Number, required: true },
    appointmentId: { type: Number, required: true },
    deletedAt: { type: String, required: true },
    deletedData: { type: Object, required: true }
});

// Función para generar un nuevo _id para las citas
const newId = () => {
    const allAppointments = Appointment.find();
    if (allAppointments.length === 0) return 1; // Si no hay citas, el primer _id será 1
    return Math.max(...allAppointments.map(a => a._id)) + 1;
};

// Función para generar un nuevo _id para los logs de eliminación
const newLogId = () => {
    const allLogs = DeletionLog.find();
    if (allLogs.length === 0) return 1; // Si no hay logs, el primer _id será 1
    return Math.max(...allLogs.map(log => log._id)) + 1;
};

// GET - Obtener todas las citas
app.get('/api/appointments', (req, res) => {
    try {
        const appointments = Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Obtener citas por fecha
app.get('/api/appointments/date/:date', (req, res) => {
    try {
        const { date } = req.params;
        const appointments = Appointment.find(appointment => appointment.date === date);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Crear nueva cita
app.post('/api/appointments', (req, res) => {
    try {
        const { date, time, name, reason } = req.body;
        const _id = newId(); // Generar _id automáticamente

        // Verificar si ya existe una cita en ese horario
        const existingAppointment = Appointment.find(
            app => app.date === date && app.time === time && !app.available
        )[0];

        if (existingAppointment) {
            return res.status(400).json({ error: 'Time slot is already booked' });
        }

        // Crear la nueva cita
        const appointment = Appointment.create({
            _id, // Incluye el _id generado automáticamente
            date,
            time,
            available: false,
            appointment: {
                name,
                reason
            }
        }).save();

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Cancelar cita y guardar log
app.delete('/api/appointments/:date/:time', (req, res) => {
    console.log('DELETE endpoint alcanzado');
    try {
        const { date, time } = req.params;

        // Buscar la cita específica
        const appointment = Appointment.find(
            app => app.date === date && app.time === time
        )[0];

        // Verificar si la cita existe
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Guardar la información de la cita eliminada en los logs
        const logId = newLogId();
        const logEntry = DeletionLog.create({
            _id: logId,
            appointmentId: appointment._id,
            deletedAt: new Date().toISOString(),
            deletedData: {
                date: appointment.date,
                time: appointment.time,
                appointment: appointment.appointment
            }
        }).save();

        // Cancelar la cita
        appointment.remove(appointment);

        res.json({ message: 'Appointment cancelled and logged successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Configuración del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
