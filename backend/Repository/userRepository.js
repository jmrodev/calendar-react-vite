import UserSchema from "../Models/UserSchema.js";

export const createUserRepository = async (userData) => {
  try {
    const newUser = await UserSchema.create(userData).save();
    return newUser;
  } catch (error) {
    throw new Error(`Error en createUserRepository: ${error.message}`);
  }
};

export const deleteUserRepository = async (id) => {
  try {
    const user = await UserSchema.delete({ _id: Number(id) });
    if (!user) {
      throw new Error(
        "Error en deleteUserRepository: Usuario no encontrado para eliminar"
      );
    }
    return user;
  } catch (error) {
    throw new Error(
      `Error en deleteUserRepository: al eliminar el usuario: ${error.message}`
    );
  }
};

export const getAllUsersRepository = async () => {
  try {
    return await UserSchema.find();
  } catch (error) {
    throw new Error(
      `Error en getAllUsersRepository: al obtener todos los usuarios: ${error.message}`
    );
  }
};

export const getUserByIdRepository = async (id) => {
  try {
    const user = await UserSchema.findOne({ _id: Number(id) });
    if (!user) {
      throw new Error("Error en getUserByIdRepository: Usuario no encontrado");
    }
    return user;
  } catch (error) {
    throw new Error(
      `Error en getUserByIdRepository: al obtener el usuario por ID: ${error.message}`
    );
  }
};
