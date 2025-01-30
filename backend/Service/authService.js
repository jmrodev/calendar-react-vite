import jwt from "jsonwebtoken";
import { authRepository } from "../Repository/authRepository.js";
import { userRepository } from "../Repository/userRepository.js";
import { verifyPassword } from "../Utils/auth/verifiPassword.js";
import { createStructuredDate } from "../Utils/date/dateUtils.js";

export class AuthService {
  constructor() {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
    this.MAX_LOGIN_ATTEMPTS = 5;
    this.LOCK_TIME = 30 * 60 * 1000;
  }

  async login(username, password, rememberMe = false, requestInfo = {}) {
    try {
      if (!username || !password) {
        console.error("Error: Usuario y contraseña son requeridos");
        throw new Error("Usuario y contraseña son requeridos");
      }

      const user = await this.userRepository.findByUsername(username, true);
      
      if (!user) {
        console.error("Error: Usuario no encontrado");
        throw new Error("Usuario no encontrado");
      }else {
        console.log("user", user);
      }

      const loginAttempt = await this.authRepository.saveLoginAttempt(
        username,
        false,
        requestInfo.ip || "",
        requestInfo.userAgent || ""
      );
      

      const isValid = await verifyPassword(password, user.password);
      

      if (!isValid) {
        console.error("Error: Contraseña incorrecta");
        await this._handleFailedLogin(user);
        throw new Error("Contraseña incorrecta");
      }else {
        console.log("isValid", isValid);
      }

      await this.authRepository.saveLoginAttempt(
        username,
        true,
        requestInfo.ip || "",
        requestInfo.userAgent || ""
      );

      await this._handleSuccessfulLogin(user);

      const token = this._generateToken(user, rememberMe);
      console.log("user authservice", user);

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
      console.error("Error en login:", error.message);
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  async logout(session) {
    try {
      if (session) {
        await session.destroy();
      }
      return { success: true };
    } catch (error) {
      throw new Error(`Error en logout: ${error.message}`);
    }
  }

  async register(username, password, role) {
    try {
      if (!username || !password || !role) {
        console.error("Error: Todos los campos son requeridos");
        throw new Error("Todos los campos son requeridos");
      }

      if (password.length < process.env.PASSWORD_MIN_LENGTH) {
        throw new Error(
          `La contraseña debe tener al menos ${process.env.PASSWORD_MIN_LENGTH} caracteres`
        );
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error(
          "La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales"
        );
      }

      const existingUser = await this.userRepository.findByUsername(username);
      if (existingUser) {
        console.error("Error: El usuario ya existe");
        throw new Error("El usuario ya existe");
      }

      const newUser = await this.userRepository.create({
        username,
        password,
        role,
      });

      return {
        success: true,
        user: {
          id: newUser._id,
          username: newUser.username,
          role: newUser.role,
        },
      };
    } catch (error) {
      console.error("Error en registro:", error.message);
      throw new Error(`Error en registro: ${error.message}`);
    }
  }

  _generateToken(user, rememberMe) {
    return jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1h" }
    );
  }

  async _handleFailedLogin(user) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    if (user.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      await this.userRepository.update(user._id.toString(), user);
      throw new Error(`Cuenta bloqueada temporalmente`);
    }

    await this.userRepository.update(user._id.toString(), user);
  }

  async _handleSuccessfulLogin(user) {
    if (!user._id) {
      console.error("Error: El usuario no tiene un _id definido", user);
      throw new Error("Usuario inválido: Falta el identificador (_id)");
    }

    user.loginAttempts = 0;
    user.lastLogin = createStructuredDate(new Date());

    await this.userRepository.update(user._id.toString(), user);
  }
}

export const authService = new AuthService();
