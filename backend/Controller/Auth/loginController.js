import { loginService } from '../../Service/Auth/index.js';

export const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await loginService(username, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}; 