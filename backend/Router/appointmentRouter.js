import { Router } from 'express';
import {
    createAppointmentController,
    getAllAppointmentsController,
    getAppointmentByIdController,
    deleteAppointmentController,
    getConfirmedAppointmentsController,
    confirmAppointmentController
} from '../Controller/Appointment/index.js';
import { authorize } from '../Middleware/roles/authorize.js';
import { authToken } from '../Middleware/token/authToken.js';
import { getAppointmentByDateController } from '../Controller/Appointment/getAppointmentByDateController.js';

const router = Router();

router.post(
    '/',
    authToken,
    (req, res, next) => {
        console.log(
            'Request to create a new appointment raiz',
        );

        next();
    },
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
    (req, res, next) => {
        console.log(
            'Request to get all appointments ',
        );

        next();
    },
    getAllAppointmentsController
);

router.put(
    '/confirm/:id',
    authToken,
    authorize(
        'appointments',
        'update'
    ),
    (req, res, next) => {
        console.log(
            'Request to confirm appointment ',
        );

        next();
    },
    confirmAppointmentController
);

router.get(
    '/confirmed',
    authToken,
    authorize(
        'appointments',
        'read'
    ),
    (req, res, next) => {
        console.log(
            'Request to get all confirmed appointments ',
        );

        next();
    },
    getConfirmedAppointmentsController
);

router.get(
    '/:id',
    authToken,
    authorize(
        'appointments',
        'read'
    ),
    (req, res, next) => {
        console.log(
            'Request to get appointment by id ',
        );

        next()
    },
    getAppointmentByIdController
);

router.delete(
    '/:id',
    authToken,
    authorize(
        'appointments',
        'delete'
    ),
    (req, res, next) => {
        console.log(
            'Request to delete appointment by id ',
        );

        next()
    },
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
        console.log(
            'Request to get appointments by date',
        );
        next();
    },
    getAppointmentByDateController
);

export default router;