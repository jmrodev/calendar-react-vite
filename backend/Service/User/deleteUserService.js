import { deleteUserRepository } from '../../Repository/User/deleteUserRepository.js';
import { getUserByIdRepository } from '../../Repository/User/getUserByIdRepository.js';

export const deleteUser = async (id) => {
    try {
        await getUserByIdRepository(id);
        return await deleteUserRepository(id);
    } catch (error) {
        throw new Error(`Error in delete user service: ${error.message}`);
    }
}; 