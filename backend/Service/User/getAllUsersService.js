import { getAllUsersRepository } from '../../Repository/User/index.js';

export const getAllUsers = async () => {
    try {
        return await getAllUsersRepository();
    } catch (error) {
        throw new Error(`Error in get all users service: ${error.message}`);
    }
}; 