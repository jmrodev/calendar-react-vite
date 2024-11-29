import bcrypt from 'bcrypt';

export async function hashPassword(userData) {

    if (!userData.password || userData.password.startsWith('$2b$')) {
        return userData;
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return { ...userData, password: hashedPassword };
}