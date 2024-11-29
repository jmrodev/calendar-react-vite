import { Router } from 'express';
import {
    loginController,
    logoutController
} from '../Controller/Auth/index.js';

const router = Router();

router.post('/login', loginController);
router.post('/logout', logoutController);

export default router;