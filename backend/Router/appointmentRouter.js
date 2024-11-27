import express from 'express';
import { authenticateToken, authorize } from '../Middleware/authMiddleware.js';
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

appointmentRouter.post('/',
     authenticateToken,
     authorize('users', 'create'),
     createAppointment);

appointmentRouter.get('/',
    authenticateToken,
    authorize('users', 'read'), 
    getAllAppointments);

appointmentRouter.get('/:id',
    authenticateToken,
    authorize('users', 'read'),
    getAppointmentById);

appointmentRouter.delete('/:id',
    authenticateToken,
    authorize('users', 'delete'),
    deleteAppointment);

appointmentRouter.get('/date/:date',
    authenticateToken,
    authorize('users', 'read'),
    getAppointmentsByDate);

appointmentRouter.put('/confirm/:id',
    authenticateToken,
    authorize('users', 'update'),
    confirmAppointment);

appointmentRouter.put('/complete/:id',
    authenticateToken,
    authorize('users', 'update'),
    completeAppointment);

appointmentRouter.delete('/:date/:time',
    authenticateToken,
    authorize('users', 'delete'),
    deleteAppointment);
    
export default appointmentRouter;