import { authenticateToken, authorizeRoles } from '../Auth/authMiddleware.js';
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
import { login } from '../Auth/auth.js';

const router = Router();

router.post('/login', login); // Aquí se asocia la ruta /login con la función login

// POST - Crear nueva cita
router.post('/appointments', authenticateToken, authorizeRoles('admin', 'user'), createAppointment);

// GET - Obtener todas las citas
router.get('/appointments', getAllAppointments);

// GET - Obtener cita por ID
router.get('/appointments/:id', getAppointmentById);

// DELETE - Eliminar cita por ID
router.delete('/appointments/:id', deleteAppointment);

// GET - Obtener citas por fecha
router.get('/appointments/date/:date', getAppointmentsByDate);

// PUT - Confirmar cita
router.put('/appointments/confirm/:id', confirmAppointment);

// PUT - Completar cita
router.put('/appointments/complete/:id', completeAppointment);

// DELETE - Cancelar cita por fecha y hora (si es necesario)
router.delete('/appointments/:date/:time', async (req, res) => {
    // Aquí puedes implementar la lógica si es necesario
    // O puedes eliminar esta ruta si no es necesaria
});

export default router;