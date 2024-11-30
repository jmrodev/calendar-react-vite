import { registerService } from '../../Service/Auth/index.js';

export const registerController = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Error en registerController: Todos los campos son requeridos'
            });
        }

        const result = await registerService(username, password, role);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 