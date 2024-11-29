import { UserSchema } from '../../Models/UserSchema.js';

export const createUserRepository = async (userData) => {
    try {
        const user = await UserSchema.create(userData);
        return await user.save();
    } catch (error) {
        throw new Error(`Error creating user in repository: ${error.message}`);
    }
}; 