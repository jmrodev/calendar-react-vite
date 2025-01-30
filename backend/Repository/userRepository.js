import UserSchema from "../Models/UserSchema.js";

export class UserRepository {
  constructor() {
    this.users = UserSchema;
  }

  async update(id, userData) {
    try {
      // Aseguramos que el _id no se modifique
      const updateData = { ...userData };
      delete updateData._id;

      // Aseguramos que lockUntil no sea null
      if (updateData.lockUntil === undefined) {
        updateData.lockUntil = null;
      }

      const user = await this.users.findOne({ _id: id });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Actualizamos los campos del usuario
      Object.assign(user, updateData);

      // Guardamos el usuario actualizado
      await user.save();
      return user;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async findByUsername(username, includeAuth = false) {
    try {
      const user = await this.users.findOne({ username });
      if (!user) return null;

      // Si no necesitamos datos de autenticación, los removemos
      if (!includeAuth) {
        const { password, loginAttempts, lockUntil, ...rest } = user;
        return rest;
      }

      return user;
    } catch (error) {
      throw new Error(`Error al buscar usuario por username: ${error.message}`);
    }
  }
}

export const userRepository = new UserRepository();