import { Router } from 'express';
import { login, register } from '../Controller/authController.js';
import { loginLimiter } from '../Utils/authUtils.js';

const authRouter = Router();

authRouter.post('/login', loginLimiter, login); // Aquí se asocia la ruta /login con la función login
authRouter.post('/register', register);

export default authRouter;