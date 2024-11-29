import { loginService } from '../../Service/Auth/index.js';

export const loginController = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        const result = await loginService(
            username, 
            password, 
            req // Pass the entire request object
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
