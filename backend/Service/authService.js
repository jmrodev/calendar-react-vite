import jwt from "jsonwebtoken";
import { findUserByUsername } from "../Utils/user/findUserByName.js";
import { verifyPassword } from "../Utils/auth/verifiPassword.js";
import { saveLoginAttempt } from "../Repository/authRepository.js";
import { createStructuredDate } from "../Utils/date/dateUtils.js";
import { createUser } from "../Utils/user/createUserUtil.js";
import { handleLoginAttempts } from "../Utils/auth/loginUtils.js";

// Función helper para convertir fecha estructurada a timestamp
const getTimestamp = (structuredDate) => {
  if (!structuredDate) return null;
  return new Date(
    structuredDate.year,
    structuredDate.month,
    structuredDate.day,
    structuredDate.hours || 0,
    structuredDate.minutes || 0,
    structuredDate.seconds || 0
  ).getTime();
};

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

    const currentTimestamp = Date.now();
    console.log("currentTimestamp", currentTimestamp);
    console.log("user.lockUntil", user.lockUntil);
    
    const lockTimestamp = getTimestamp(user.lockUntil);
    console.log("lockTimestamp", lockTimestamp);
    
    // Check if account is locked
    if (lockTimestamp && currentTimestamp < lockTimestamp) {
      const lockDate = new Date(lockTimestamp);
      const minutesLeft = Math.ceil((lockTimestamp - currentTimestamp) / (60 * 1000));
      throw new Error(`Cuenta bloqueada temporalmente. Intente nuevamente en ${minutesLeft} minutos`);
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      await handleLoginAttempts(user);
      await saveLoginAttempt(username, false);
      throw new Error("Contraseña incorrecta");
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = createStructuredDate(new Date());
    user.lastLogin = createStructuredDate(new Date());
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

    console.log('Token generado:', token); // Para debugging

    return {
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Error completo:', error);
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
