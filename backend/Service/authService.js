import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../Utils/user/findUserByName.js';
import { verifyPassword } from '../Utils/auth/verifiPassword.js';
import { loginLimiter } from '../Utils/login/loginLimiter.js';
import { saveLoginAttempt, getLoginAttempts } from '../Repository/authRepository.js';
import { standardizeDate } from '../Utils/date/dateUtils.js';
import { createUser } from '../Utils/user/createUserUtil.js';

export const loginService = async (username, password, req) => {
    try {
        if (!username || !password) {
            throw new Error('Error en loginService: Usuario y contraseña son requeridos');
        }

        const user = await findUserByUsername(username);
        if (!user) {
            await saveLoginAttempt(username, false);
            throw new Error('Error en loginService: Usuario no encontrado');
        }


        if (user.lockUntil && user.lockUntil > standardizeDate(new Date())) {
            throw new Error('Error en loginService: Cuenta bloqueada temporalmente');
        }

        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {

            user.loginAttempts = (user.loginAttempts || 0) + 1;
            if (user.loginAttempts >= 5) {
                user.lockUntil = standardizeDate(new Date(Date.now() + 15 * 60 * 1000));
            }
            await user.save();
            await saveLoginAttempt(username, false);
            throw new Error('Error en loginService: Contraseña inválida');
        }


        user.loginAttempts = 0;
        user.lockUntil = "";
        user.lastLogin = standardizeDate(new Date());
        await user.save();
        await saveLoginAttempt(username, true);


        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            success: true,
            token,
            user: {
                id: user._id, username: user.username, role: user.role
            }
        };
    } catch (error) {
        throw new Error(`Error en loginService: ${error.message}`);
    }
};

export const logoutService = async (session) => {
    try {
        if (session) {
            await session.destroy();
        }
    } catch (error) {
        throw new Error(`Logout error: ${error.message}`);
    }
};


export const registerService = async (username, password, role) => {
    try {

        if (!username || !password || !role) {
            throw new Error('Error en registerService: Todos los campos son requeridos');
        }

        const newUser = await createUser(username, password, role);

        return {
            success: true,
            user: {
                id: newUser._id, username: newUser.username, 
                role: newUser.role, createdAt: newUser.createdAt
            }
        };
    } catch (error) {
        throw new Error(`Error en registerService: ${error.message}`);
    }

}

