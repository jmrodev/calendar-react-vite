import { Router } from 'express';
import { login, register, loginLimiter } from '../Controller/authController.js';

const authRouter = Router();

authRouter.post('/login', loginLimiter, login); // Aquí se asocia la ruta /login con la función login
authRouter.post('/register', register);

export default authRouter;