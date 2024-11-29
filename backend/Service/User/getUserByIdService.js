import { getUserByIdRepository } from '../../Repository/User/index.js';

export const getUserById = async (id) => {
    try {
        return await getUserByIdRepository(id);
    } catch (error) {
        throw new Error(`Error in get user by id service: ${error.message}`);
    }
}; 