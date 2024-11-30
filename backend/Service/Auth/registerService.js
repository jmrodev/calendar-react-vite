import { createUser } from '../../Utils/user/createUserUtil.js';

export const registerService = async (username, password, role) => {
    try {
        // Validar campos requeridos
        if (!username || !password || !role) {
            throw new Error('Error en registerService: Todos los campos son requeridos');
        }

        const newUser = await createUser(username, password, role);
        
        return {
            success: true,
            user: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role,
                createdAt: newUser.createdAt
            }
        };
    } catch (error) {
        throw new Error(`Error en registerService: ${error.message}`);
    }
}; 