import { authenticateToken, authorizeRoles } from '../authMiddleware.js';
import { Router } from 'express';
import { 
    createAppointment, 
    getAllAppointments, 
    getAppointmentById, 
    deleteAppointment, 
    getAppointmentsByDate, 
    confirmAppointment, 
    completeAppointment 
} from '../Controller/AppointmentController.js'; // Importa las funciones del controlador

const router = Router();

// POST - Crear nueva cita
router.post('/api/appointments', authenticateToken, authorizeRoles('admin', 'user'), createAppointment);

// GET - Obtener todas las citas
router.get('/api/appointments', getAllAppointments);

// GET - Obtener cita por ID
router.get('/api/appointments/:id', getAppointmentById);

// DELETE - Eliminar cita por ID
router.delete('/api/appointments/:id', deleteAppointment);

// GET - Obtener citas por fecha
router.get('/api/appointments/date/:date', getAppointmentsByDate);

// PUT - Confirmar cita
router.put('/api/appointments/confirm/:id', confirmAppointment);

// PUT - Completar cita
router.put('/api/appointments/complete/:id', completeAppointment);

// DELETE - Cancelar cita por fecha y hora (si es necesario)
router.delete('/api/appointments/:date/:time', async (req, res) => {
    // Aquí puedes implementar la lógica si es necesario
    // O puedes eliminar esta ruta si no es necesaria
});

export default router;