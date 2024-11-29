import { Router } from 'express';
import {
    createAppointmentController,
    getAllAppointmentsController,
    getAppointmentByIdController,
    deleteAppointmentController
} from '../Controller/Appointment/index.js';
import { authorize } from '../Middleware/roles/authorize.js';
import { authToken } from '../Middleware/token/authToken.js';

const router = Router();

router.post(
    '/',
    authToken,
    authorize(
        'appointment',
        'create'
    ),
    createAppointmentController
);

router.get(
    '/',
    authToken,
    authorize(
        'appointment',
        'read'
    ),
    getAllAppointmentsController
);

router.get(
    '/:id',
    authToken,
    authorize(
        'appointment',
        'read'
    ),
    getAppointmentByIdController
);

router.delete(
    '/:id',
    authToken,
    authorize(
        'appointment',
        'delete'
    ),
    deleteAppointmentController
);

export default router;