import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as appointmentController from '../Controller/appointmentController.js';

const router = Router();

// Log middleware para debugging
router.use((req, res, next) => {
  next();
});

// Proteger todas las rutas con authMiddleware
router.use(authMiddleware);

// Rutas GET
router.get('/', appointmentController.getAllAppointmentsController);
router.get('/date/:date', appointmentController.getAppointmentByDateController);
router.get('/weekday/:dayOfWeek', appointmentController.getAppointmentsByWeekDayController);
router.get('/week', appointmentController.getWeekAppointmentsController);
router.get('/user', appointmentController.getUserAppointmentsController);
router.get('/:id', appointmentController.getAppointmentByIdController);

// Rutas POST
router.post('/', appointmentController.createAppointmentController);

// Rutas PUT
router.put('/update/:id', appointmentController.updateAppointmentController);
router.put('/complete/:id', appointmentController.completeAppointmentController);
router.put('/confirm/:id', appointmentController.confirmAppointmentController);
router.put('/:id/cancel', appointmentController.cancelAppointmentController);

// Rutas DELETE
router.delete('/:id', appointmentController.deleteAppointmentController);

export default router; 