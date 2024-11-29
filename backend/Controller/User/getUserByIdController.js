import { getUserById } from '../../Service/User/index.js';

export const getUserByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 