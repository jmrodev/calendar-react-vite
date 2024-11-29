import { UserSchema } from '../../Models/UserSchema.js';

export const getUserByIdRepository = async (id) => {
    try {
        const user = await UserSchema.find({ _id: Number(id) });
        if (!user || user.length === 0) {
            throw new Error('User not found');
        }
        return user[0];
    } catch (error) {
        throw new Error(`Error getting user by id in repository: ${error.message}`);
    }
}; 