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
appointmentRouter.post('/', authenticateToken, authorizeRoles('admin', 'user'), createAppointment);

// GET - Obtener todas las citas
appointmentRouter.get('/', getAllAppointments);

// GET - Obtener cita por ID
appointmentRouter.get('/:id', getAppointmentById);

// DELETE - Eliminar cita por ID
appointmentRouter.delete('/:id', deleteAppointment);

// GET - Obtener citas por fecha
appointmentRouter.get('/date/:date', getAppointmentsByDate);

// PUT - Confirmar cita
appointmentRouter.put('/confirm/:id', confirmAppointment);

// PUT - Completar cita
appointmentRouter.put('/complete/:id', completeAppointment);

// DELETE - Cancelar cita por fecha y hora (si es necesario)
appointmentRouter.delete('/:date/:time', async (req, res) => {
    // Aquí puedes implementar la lógica si es necesario
    // O puedes eliminar esta ruta si no es necesaria
});

export default appointmentRouter;