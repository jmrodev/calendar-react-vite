import { findUserByUsername } from '../../Utils/user/findUserByName.js';
import { verifyPassword } from '../../Utils/auth/verifiPassword.js';
import { loginLimiter } from '../../Utils/login/loginLimiter.js';
import { saveLoginAttempt, getLoginAttempts } from '../../Repository/Auth/index.js';

export const loginService = async (username, password) => {
    try {
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        await loginLimiter(username);

        const user = await findUserByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid password');
        }

        return {
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        };
    } catch (error) {
        throw new Error(`Login error: ${error.message}`);
    }
}; 