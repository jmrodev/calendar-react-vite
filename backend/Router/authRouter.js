import { Router } from 'express';
import {
    loginController,
    logoutController,
    registerController
} from '../Controller/Auth/index.js';

const router = Router();

router.post(
    '/login',
     loginController
)
router.post('/logout', logoutController);
router.post('/register', registerController);

export default router;