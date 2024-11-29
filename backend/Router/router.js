import { Router } from 'express';
import authRouter from './authRouter.js';
import appointmentRouter from './appointmentRouter.js';
import userRouter from './userRouter.js';

const router = Router();

router.use(
    '/auth',
    authRouter
);
router.use(
    '/appointments',
   
    appointmentRouter
);
router.use(
    '/users',
    //  (req, res, next) => {
    //     console.log('GET /users - User:', req);
    //     next();
    // },
    userRouter
);

export default router;