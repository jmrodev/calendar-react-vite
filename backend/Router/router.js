import { Router } from 'express';
import authRouter from './authRouter.js';
import  appointmentRouter  from './appointmentRouter.js';



const router = Router();

router.use('/auth', authRouter);
router.use('/appointments', appointmentRouter);

export default router;