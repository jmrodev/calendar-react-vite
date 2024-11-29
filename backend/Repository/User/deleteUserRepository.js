import { UserSchema } from '../../Models/UserSchema.js';

export const deleteUserRepository = async (id) => {
    try {
        const user = await UserSchema.delete({ _id: Number(id) });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error(`Error deleting user in repository: ${error.message}`);
    }
}; 