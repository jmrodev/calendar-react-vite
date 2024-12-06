import { createUser } from '../../Utils/user/createUserUtil.js';

export const createUserRepository = async (userData) => {
    try {
        const newUser = await createUser(userData.username, userData.password, userData.role);

        return newUser;
        
    
    
    } catch (error) {
        throw new Error(`Error en createUserRepository: ${error.message}`);
    }
}; 