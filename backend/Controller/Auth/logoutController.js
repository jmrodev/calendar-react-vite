import { logoutService } from '../../Service/Auth/index.js';

export const logoutController = async (req, res) => {
    try {
        await logoutService(req.session);
        res.json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 