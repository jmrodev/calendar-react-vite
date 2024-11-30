import { UserSchema } from '../../Models/UserSchema.js';

export const getUserByIdRepository = async (id) => {
    try {
        const user = await UserSchema.find({ _id: Number(id) });
        if (!user) {
            throw new Error('Error en getUserByIdRepository: Usuario no encontrado');
        }
        return user;
    } catch (error) {
        throw new Error(`Error en getUserByIdRepository: al obtener el usuario por ID: ${error.message}`);
    }
}; 