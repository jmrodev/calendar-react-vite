import UserSchema from "../Models/UserSchema.js";

export const createUserRepository = async (userData) => {
  try {
    const user = await UserSchema.create(userData).save();
    return user;
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
};

export const deleteUserRepository = async (id) => {
  try {
    const user = await UserSchema.findOne({ _id: Number(id) });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    await user.remove();
    return user;
  } catch (error) {
    throw new Error(`Error al eliminar usuario: ${error.message}`);
  }
};

export const getAllUsersRepository = async (filters) => {
  try {
    const { role, status, search, pagination } = filters;
    let query = {};
    
    // Aplicar filtros
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    // Calcular paginación
    const skip = (pagination.page - 1) * pagination.limit;
    
    // Obtener total de documentos
    const total = await UserSchema.find(query).length;
    
    // Obtener usuarios paginados
    const users = await UserSchema.find(query)
      .skip(skip)
      .limit(pagination.limit);

    return {
      users,
      total
    };
  } catch (error) {
    throw new Error(`Error al obtener usuarios: ${error.message}`);
  }
};

export const getUserByIdRepository = async (id) => {
  try {
    const user = await UserSchema.findOne({ _id: Number(id) });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  } catch (error) {
    throw new Error(`Error al obtener usuario: ${error.message}`);
  }
};
