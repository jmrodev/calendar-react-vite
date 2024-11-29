import { deleteUser } from '../../Service/User/index.js';

export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUser(id);
        res.json({
            success: true,
            deletedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 