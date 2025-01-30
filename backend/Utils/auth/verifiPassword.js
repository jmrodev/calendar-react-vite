import bcrypt from "bcrypt";

export async function verifyPassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) {
    throw new Error("Error en verifyPassword: Las contraseñas son requeridas");
  }

  try {
    // Asegurarnos de que siempre estemos trabajando con contraseñas hasheadas
    if (!hashedPassword.startsWith("$2b$")) {
      throw new Error("La contraseña almacenada no está hasheada correctamente");
    }

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(
      `Error en verifyPassword: al verificar la contraseña: ${error.message}`
    );
  }
}