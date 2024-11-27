import express from 'express';
import { authenticateToken, authorizeRoles } from '../Middleware/authMiddleware.js';
import { 
    createAppointment, 
    getAllAppointments, 
    getAppointmentById, 
    deleteAppointment, 
    getAppointmentsByDate, 
    confirmAppointment, 
    completeAppointment 
} from '../Controller/AppointmentController.js';

const appointmentRouter = express.Router();

// Rutas de citas
// POST - Crear nueva cita
appointmentRouter.post('/', authenticateToken, createAppointment);

// GET - Obtener todas las citas
appointmentRouter.get('/', authenticateToken, getAllAppointments);

// GET - Obtener cita por ID
appointmentRouter.get('/:id', authenticateToken, getAppointmentById);

// DELETE - Eliminar cita por ID
appointmentRouter.delete('/:id', authenticateToken, deleteAppointment);

// GET - Obtener citas por fecha
appointmentRouter.get('/date/:date', authenticateToken, getAppointmentsByDate);

// PUT - Confirmar cita
appointmentRouter.put('/confirm/:id', authenticateToken, confirmAppointment);

// PUT - Completar cita
appointmentRouter.put('/complete/:id', authenticateToken, completeAppointment);

// DELETE - Cancelar cita por fecha y hora (si es necesario)
appointmentRouter.delete('/:date/:time', authenticateToken, async (req, res) => {
    // Aquí puedes implementar la lógica si es necesario
    // O puedes eliminar esta ruta si no es necesaria
});

export default appointmentRouter;