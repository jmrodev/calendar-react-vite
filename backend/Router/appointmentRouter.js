import { Router } from 'express';
import {
    createAppointmentController,
    getAllAppointmentsController,
    getAppointmentByIdController,
    deleteAppointmentController,
    getConfirmedAppointmentsController,
    confirmAppointmentController,
    getAppointmentByDateController
} from '../Controller/Appointment/index.js';
import { authorize } from '../Middleware/roles/authorize.js';
import { authToken } from '../Middleware/token/authToken.js';

const router = Router();

router.post(
    '/',
    authToken,
    authorize(
        'appointments',
        'create'
    ),
    createAppointmentController
);

router.get(
    '/',
    authToken,
    authorize(
        'appointments',
        'read'),
    getAllAppointmentsController
);

router.put(
    '/confirm/:id',
    authToken,
    authorize(
        'appointments',
        'update'
    ),

    confirmAppointmentController
);

router.get(
    '/confirmed',
    authToken,
    authorize(
        'appointments',
        'read'
    ),
    getConfirmedAppointmentsController
);

router.get(
    '/:id',
    authToken,
    authorize(
        'appointments',
        'read'
    ),
    getAppointmentByIdController
);

router.delete(
    '/:id',
    authToken,
    authorize(
        'appointments',
        'delete'
    ),
    deleteAppointmentController
);

router.get(
    '/date/:date',
    authToken,
    authorize(
        'appointments',
        'read'
    ),
    (req, res, next) => {
        console.log(`Request received for appointments on date: ${req.params.date}`);
        getAppointmentByDateController(req, res, next);
        console.log(`Response sent for appointments on date: ${req.params.date}`);
    }
);

export default router;