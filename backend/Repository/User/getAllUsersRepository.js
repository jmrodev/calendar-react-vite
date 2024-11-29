import { UserSchema } from '../../Models/UserSchema.js';

export const getAllUsersRepository = async () => {
    try {
        return await UserSchema.find();
    } catch (error) {
        throw new Error(`Error getting all users in repository: ${error.message}`);
    }
}; 