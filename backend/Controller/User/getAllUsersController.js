import { getAllUsers } from '../../Service/User/index.js';

export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 