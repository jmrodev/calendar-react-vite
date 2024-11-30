import { createUser } from '../../Utils/user/createUserUtil.js';

export const createUserController = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const newUser = await createUser(username, password, role);
        
        // No enviar la contraseña en la respuesta
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
}; 

