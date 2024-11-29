import { findUserByUsername } from '../../Utils/user/findUserByName.js';
import { verifyPassword } from '../../Utils/auth/verifiPassword.js';
import { loginLimiter } from '../../Utils/login/loginLimiter.js';
import { saveLoginAttempt, getLoginAttempts } from '../../Repository/Auth/index.js';

export const loginService = async (
    username,
    password,
    req // Pass the entire request object
) => {
    try {
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        // // Use a fallback IP method
        // const ipAddress = req.ip || 
        //                   req.connection?.remoteAddress || 
        //                   req.socket?.remoteAddress || 
        //                   '127.0.0.1';

        // await loginLimiter(ipAddress); // Use IP address for rate limiting

        const user = await findUserByUsername(username);
        if (!user) {
            await saveLoginAttempt(username, false, ipAddress);
            throw new Error('User not found');
        }

        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            await saveLoginAttempt(username, false, ipAddress);
            throw new Error('Invalid password');
        }

        await saveLoginAttempt(username, true, ipAddress);

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
