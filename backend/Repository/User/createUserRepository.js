import { createUser } from '../../Utils/user/createUserUtil.js';

export const createUserRepository = async (userData) => {
    try {
        return await createUser(userData.username, userData.password, userData.role);
    } catch (error) {
        throw new Error(`Error en createUserRepository: ${error.message}`);
    }
}; 