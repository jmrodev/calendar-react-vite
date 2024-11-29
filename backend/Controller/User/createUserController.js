import { createUser } from '../../Service/User/createUserService.js';

export const createUserController = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const newUser = await createUser(username, password, role);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 

