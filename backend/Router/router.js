import { Router } from 'express';
import authRouter from './authRouter.js';
import appointmentRouter from './appointmentRouter.js';
import userRouter from './userRouter.js';

const router = Router();

router.use(
    '/auth',
    (req, res, next) => {
    console.log('Request to /auth');
        next();
    },
    authRouter
);
router.use(
    '/appointments',
    (req, res, next) => {
    console.log('Request to /router/appointment');
    console.log(req.headers);
    console.log(req.body);
    console.log(req.user);
    console.log(req.role);
    console.log(req.permissions);
    console.log(req.token);
        next();
    },
    appointmentRouter
);
router.use(
    '/users',
     (req, res, next) => {
    console.log('Request to /users');
        next();
    },
    userRouter
);

export default router;