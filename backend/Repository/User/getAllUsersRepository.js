import { UserSchema } from '../../Models/UserSchema.js';

export const getAllUsersRepository = async () => {
    try {
        return await UserSchema.find();
    } catch (error) {
        throw new Error(`Error en getAllUsersRepository: al obtener todos los usuarios: ${error.message}`);
    }
}; 