import bcrypt from 'bcrypt';

export async function verifyPassword(plainPassword, hashedPassword) {

    if (!plainPassword || !hashedPassword) {
        throw new Error('Error en verifyPassword: Las contraseñas son requeridas');
    }
    
    try {
        if (!hashedPassword.startsWith('$2b$')) {
            return plainPassword === hashedPassword;
        }
        
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error(`Error en verifyPassword: al verificar la contraseña: ${error.message}`);
    }
}
