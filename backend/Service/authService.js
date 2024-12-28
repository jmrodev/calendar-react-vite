import jwt from "jsonwebtoken";
import { findUserByUsername } from "../Utils/user/findUserByName.js";
import { verifyPassword } from "../Utils/auth/verifiPassword.js";
import { saveLoginAttempt } from "../Repository/authRepository.js";
import { standardizeDate } from "../Utils/date/dateUtils.js";
import { createUser } from "../Utils/user/createUserUtil.js";
import { handleLoginAttempts } from "../Utils/auth/loginUtils.js";

export const loginService = async (username, password) => {
  console.log("LOGIN SERVICE", username, password);
  try {
    if (!username || !password) {
      throw new Error("Usuario y contraseña son requeridos");
    }

    const user = await findUserByUsername(username);
    console.log("USER", user);
    if (!user) {
      await saveLoginAttempt(username, false);
      throw new Error("Usuario no encontrado");
    }

    console.log("USER LOCK UNTIL", user.lockUntil);
    console.log("STANDARDIZE DATE", standardizeDate(new Date()));
    console.log(
      "USER LOCK UNTIL > STANDARDIZE DATE",
      user.lockUntil > standardizeDate(new Date())
    );

    if (user.lockUntil && user.lockUntil > standardizeDate(new Date())) {
      throw new Error("Cuenta bloqueada temporalmente");
    }

    const isValidPassword = await verifyPassword(password, user.password);
    console.log("IS VALID PASSWORD", isValidPassword);
    if (!isValidPassword) {
      await handleLoginAttempts(user);
      await saveLoginAttempt(username, false);
      throw new Error("Contraseña inválida");
    }

    console.log("USER LOGIN ATTEMPTS", user.loginAttempts);
    // Reset login attempts and update last login
    user.loginAttempts = 0;
    console.log("USER LOGIN ATTEMPTS", user.loginAttempts);
    user.lockUntil = "";
    console.log("USER LOCK UNTIL", user.lockUntil);
    user.lastLogin = standardizeDate(new Date());
    console.log("USER LAST LOGIN", user.lastLogin);
    await user.save();
    await saveLoginAttempt(username, true);

    // Crear token con información mínima necesaria
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("GENERATED TOKEN:", token);
    
    return {
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    };
  } catch (error) {
    throw new Error(`Error en loginService: ${error.message}`);
  }
};

export const logoutService = async (session) => {
  try {
    if (session) {
      await session.destroy();
    }
  } catch (error) {
    throw new Error(`Logout error: ${error.message}`);
  }
};

export const registerService = async (username, password, role) => {
  try {
    if (!username || !password || !role) {
      throw new Error(
        "Error en registerService: Todos los campos son requeridos"
      );
    }

    const newUser = await createUser(username, password, role);

    return {
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    };
  } catch (error) {
    throw new Error(`Error en registerService: ${error.message}`);
  }
};
