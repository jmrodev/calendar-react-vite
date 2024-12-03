import { Router } from 'express';
import {
    createUserController,
    deleteUserController,
    getAllUsersController,
    getUserByIdController
} from '../Controller/User/index.js';
import { authToken } from '../Middleware/token/authToken.js';
import { authorize } from '../Middleware/roles/authorize.js';

const router = Router();

router.post(
    '/',
    authToken,
    authorize(
        'user',
        'create'
    ),

    createUserController
);
router.get(
    '/',
    authToken,
    authorize(
        'users',
        'read'
    ),

    getAllUsersController
);
router.get(
    '/:id',
    authToken,
    authorize(
        'user',
        'read'
    ),
    getUserByIdController
);
router.delete(
    '/:id',
    authToken,
    authorize(
        'user',
        'delete'
    ),
    deleteUserController
);

export default router;
