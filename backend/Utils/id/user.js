import UserSchema from "../../Models/UserSchema.js";

export const newUserId = () => {
  try {
    const allUsers = UserSchema.find();
    if (!allUsers || allUsers.length === 0) return 1;
    return Math.max(...allUsers.map(user => user._id)) + 1;
  } catch (error) {
    console.error('Error en newUserId:', error);
    throw new Error(`Error al generar nuevo ID: ${error.message}`);
  }
};
