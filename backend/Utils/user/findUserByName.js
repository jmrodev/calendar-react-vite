import UserSchema from "../../Models/UserSchema.js";

export async function findUserByUsername(username) {
  try {
    const user = await UserSchema.findOne({ username });
    return user;
  } catch (error) {
    console.error('Error en findUserByUsername:', error);
    throw new Error(`Error al buscar usuario: ${error.message}`);
  }
}
