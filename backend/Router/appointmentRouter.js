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

appointmentRouter.post('/', authenticateToken, createAppointment);
appointmentRouter.get('/', authenticateToken, getAllAppointments);
appointmentRouter.get('/:id', authenticateToken, getAppointmentById);
appointmentRouter.delete('/:id', authenticateToken, deleteAppointment);
appointmentRouter.get('/date/:date', authenticateToken, getAppointmentsByDate);
appointmentRouter.put('/confirm/:id', authenticateToken, confirmAppointment);
appointmentRouter.put('/complete/:id', authenticateToken, completeAppointment);
appointmentRouter.delete('/:date/:time', authenticateToken, async (req, res) => {
});

export default appointmentRouter;