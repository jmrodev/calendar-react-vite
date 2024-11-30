import { UserSchema } from '../../Models/UserSchema.js';

export const deleteUserRepository = async (id) => {
    try {
        const user = await UserSchema.delete({ _id: Number(id) });
        if (!user) {
            throw new Error('Error en deleteUserRepository: Usuario no encontrado para eliminar');
        }
        return user;
    } catch (error) {
        throw new Error(`Error en deleteUserRepository: al eliminar el usuario: ${error.message}`);
    }
}; 