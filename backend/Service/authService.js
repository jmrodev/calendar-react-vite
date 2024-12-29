import jwt from "jsonwebtoken";
import { findUserByUsername } from "../Utils/user/findUserByName.js";
import { verifyPassword } from "../Utils/auth/verifiPassword.js";
import { saveLoginAttempt } from "../Repository/authRepository.js";
import { createStructuredDate } from "../Utils/date/dateUtils.js";
import { createUser } from "../Utils/user/createUserUtil.js";
import { handleLoginAttempts } from "../Utils/auth/loginUtils.js";

export const loginService = async (username, password) => {
  try {
    if (!username || !password) {
      throw new Error("Usuario y contraseña son requeridos");
    }

    const user = await findUserByUsername(username);
    if (!user) {
      await saveLoginAttempt(username, false);
      throw new Error("Usuario no encontrado");
    }

    const currentDate = createStructuredDate(new Date());
    const lockUntil = user.lockUntil ? createStructuredDate(user.lockUntil) : null;

    if (lockUntil && compareStructuredDates(currentDate, lockUntil) <= 0) {
      throw new Error("Cuenta bloqueada temporalmente");
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      await handleLoginAttempts(user);
      await saveLoginAttempt(username, false);
      throw new Error("Contraseña incorrecta");
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = currentDate;
    await user.save();

    await saveLoginAttempt(username, true);

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        lastLogin: user.lastLogin
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
