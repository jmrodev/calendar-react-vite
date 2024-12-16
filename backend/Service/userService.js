import {
  createUserRepository,
  deleteUserRepository,
  getAllUsersRepository,
  getUserByIdRepository,
} from "../../Repository/userRepository.js";
import { findUserByUsername } from "../../Utils/user/findUserByName.js";
import { hashPassword } from "../../Utils/auth/hashPassword.js";
import { newUserId } from "../../Utils/id/user.js";

export const createUser = async (username, password, role) => {
  try {
    // Validaciones
    if (!username || !password || !role) {
      throw new Error("All fields are required");
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      throw new Error("User already exists");
    }

    if (role !== "admin") {
      throw new Error("Invalid role to create users");
    }

    if (password.length < 8) {
      throw new Error("Password too short");
    }

    // Crear objeto de usuario
    const userData = {
      _id: newUserId(),
      username,
      password,
      role,
    };

    // Hashear contraseña y crear usuario
    const hashedUser = await hashPassword(userData);
    return await createUserRepository(hashedUser);
  } catch (error) {
    throw new Error(`Error in create user service: ${error.message}`);
  }
};

export const deleteUser = async (id) => {
  try {
    await getUserByIdRepository(id);
    return await deleteUserRepository(id);
  } catch (error) {
    throw new Error(`Error in delete user service: ${error.message}`);
  }
};

export const getAllUsers = async () => {
  try {
    return await getAllUsersRepository();
  } catch (error) {
    throw new Error(`Error in get all users service: ${error.message}`);
  }
};

export const getUserById = async (id) => {
  try {
    return await getUserByIdRepository(id);
  } catch (error) {
    throw new Error(`Error in get user by id service: ${error.message}`);
  }
};
