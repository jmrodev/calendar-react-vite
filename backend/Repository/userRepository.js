import UserSchema from "../Models/UserSchema.js";

export class UserRepository {
  constructor() {
    this.users = UserSchema;
  }

  async update(id, userData) {
    try {
      const updateData = { ...userData };
      delete updateData._id; // Evita modificar el ID

      // Buscar usuario correctamente
      const user = this.users.findOne(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Actualizar los datos
      Object.assign(user, updateData);

      // Guardar cambios (en `db-local` esto es obligatorio)
      await user.save();

      console.log("Usuario actualizado:", user);
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
        const { password, loginAttempts, ...rest } = user;
        return rest;
      }

      return user;
    } catch (error) {
      throw new Error(`Error al buscar usuario por username: ${error.message}`);
    }
  }
}

export const userRepository = new UserRepository();
