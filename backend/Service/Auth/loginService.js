import { findUserByUsername } from '../../Utils/user/findUserByName.js';
import { verifyPassword } from '../../Utils/auth/verifiPassword.js';
import { loginLimiter } from '../../Utils/login/loginLimiter.js';
import { saveLoginAttempt, getLoginAttempts } from '../../Repository/Auth/index.js';
import { standardizeDate } from '../../Utils/date/dateUtils.js';

export const loginService = async (username, password, req) => {
    console.log('loginService', username, password);
    
    try {
        if (!username || !password) {
            throw new Error('Error en loginService: Usuario y contraseña son requeridos');
        }

        const user = await findUserByUsername(username);
        if (!user) {
            await saveLoginAttempt(username, false);
            throw new Error('Error en loginService: Usuario no encontrado');
        }

        // Verificar si la cuenta está bloqueada
        if (user.lockUntil && user.lockUntil > standardizeDate(new Date())) {
            throw new Error('Error en loginService: Cuenta bloqueada temporalmente');
        }

        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            // Incrementar intentos fallidos
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            if (user.loginAttempts >= 5) {
                user.lockUntil = standardizeDate(new Date(Date.now() + 15 * 60 * 1000)); // 15 minutos
            }
            await user.save();
            await saveLoginAttempt(username, false);
            throw new Error('Error en loginService: Contraseña inválida');
        }

        // Resetear intentos fallidos después de un login exitoso
        user.loginAttempts = 0;
        user.lockUntil = "";
        user.lastLogin = standardizeDate(new Date());
        await user.save();
        await saveLoginAttempt(username, true);

        return {
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        };
    } catch (error) {
        throw new Error(`Error en loginService: ${error.message}`);
    }
};
