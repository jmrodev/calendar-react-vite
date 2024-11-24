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
    appointmentTime: { type: String, required: true },
    realAppointmentTime: { type: String, required: true },
    available: { type: Boolean, required: true },
    status: { type: String, required: true, default: 'pending' }, // pending, confirmed, completed
    appointment: {
        type: Object,
        required: true,
        schema: {    
            confirmAppointment: { type: Boolean, required: true },
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
app.post('/api/appointments', async (req, res) => {
    try {
        const { date, appointmentTime, realAppointmentTime, available, appointment } = req.body;

        // Verificar que appointmentTime, date y appointment estén presentes
        if (!appointmentTime) {
            return res.status(400).json({ error: 'The value "appointmentTime" is required.' });
        }
        if (!date) {
            return res.status(400).json({ error: 'The value "date" is required.' });
        }
        if (!appointment) {
            return res.status(400).json({ error: 'The value "appointment" is required.' });
        }

        // Verificar si ya existe una cita en la misma fecha y hora
        const existingAppointment = await Appointment.findOne({ date, appointmentTime });
        if (existingAppointment) {
            return res.status(400).json({ error: 'The selected date and time are already booked.' });
        }

        const newAppointment = Appointment.create({
            _id: newId(), // Generar un nuevo ID
            date,
            appointmentTime,
            realAppointmentTime,
            available,
            appointment
        });
        const objectSaved = await newAppointment.save(); 
        
        res.status(201).json(objectSaved);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT - Confirmar cita
app.put('/api/appointments/confirm/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { confirmAppointment } = req.body; // Se espera que se envíe el estado de confirmación
        
        // Buscar la cita por ID
        const appointment = await Appointment.find({ _id: Number(id) }); // Cambiado para usar Appointment.find

        if (!appointment || appointment.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Actualizar el estado de confirmación
        appointment[0].appointment.confirmAppointment = confirmAppointment; // Cambiar a true o false según el cuerpo de la solicitud

        // Guardar los cambios en la base de datos
        await appointment[0].save(); // Guardar la cita actualizada

        res.json({ message: 'Appointment confirmed successfully', appointment: appointment[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Cancelar cita y guardar log
app.delete('/api/appointments/:date/:time', async (req, res) => {
    console.log('DELETE endpoint alcanzado');
    try {
        const { date, time } = req.params;

        // Buscar la cita específica
        const appointment = Appointment.find(
            app => app.date === date && app.appointmentTime === time
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
                appointmentTime: appointment.appointmentTime,
                realAppointmentTime: appointment.realAppointmentTime,
                appointment: appointment.appointment
            }
        });

        await logEntry.save(); // Guardar el log de eliminación

        // Cancelar la cita
        appointment.remove(); // Eliminar la cita

        res.json({ message: 'Appointment cancelled and logged successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/appointments/complete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const appointment = await Appointment.find({ _id: Number(id) });

        if (!appointment || appointment.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointment[0].status = 'completed';
        await appointment[0].save();

        res.json({ message: 'Appointment marked as completed', appointment: appointment[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Configuración del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
