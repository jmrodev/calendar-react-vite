import { Router } from 'express';
import {
    createAppointmentController,
    getAllAppointmentsController,
    getAppointmentByIdController,
    deleteAppointmentController
} from '../Controller/Appointment/index.js';

const router = Router();

router.post('/', createAppointmentController);
router.get('/', getAllAppointmentsController);
router.get('/:id', getAppointmentByIdController);
router.delete('/:id', deleteAppointmentController);

export default router;