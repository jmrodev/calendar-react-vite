import { findUserByUsername } from "./findUserByNameUtil";
import { hashPassword } from "../auth/authHashPasswordUtil";
import { newUserId } from "../id/idUserUtil";

export const  createUser= async (username, password, role) => {
    if (!username || !password || !role) {
        throw new Error('All fields are required');
    }
    if (userData.password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    const user = await findUserByUsername(username);

    if (user) {
        throw new Error('User already exists');
    }

    if (role !== 'admin') {
        throw new Error('Invalid role to create users');
    }

    const userData = {
        _id: newUserId(),
        username,
        password,
        role
    };

    const User = await hashPassword(userData);
    return User

}

