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
    this.LOCK_TIME = 30 * 60 * 1000; // 30 minutos
  }

  async login(username, password, rememberMe = false, requestInfo = {}) {
    try {
      console.log("Inicio del proceso de login");
      
      if (!username || !password) {
        console.error("Error: Usuario y contraseña son requeridos");
        throw new Error("Usuario y contraseña son requeridos");
      }

      // Obtener usuario con información de autenticación
      const user = await this.userRepository.findByUsername(username, true);
      console.log("Usuario encontrado:", user ? "Sí" : "No");

      // Registrar intento inicial
      const loginAttempt = await this.authRepository.saveLoginAttempt(
        username,
        false,
        requestInfo.ip || "",
        requestInfo.userAgent || ""
      );

      if (!user) {
        console.error("Error: Usuario no encontrado");
        throw new Error("Usuario no encontrado");
      }

      // Verificar bloqueo
      if (user.lockUntil) {
        const lockUntil = new Date(user.lockUntil);
        if (lockUntil > new Date()) {
          const minutesLeft = Math.ceil((lockUntil - new Date()) / (60 * 1000));
          throw new Error(
            `Cuenta bloqueada temporalmente. Intente nuevamente en ${minutesLeft} minutos`
          );
        }
      }

      const isValid = await verifyPassword(password, user.password);
      console.log("Validación de contraseña:", isValid);
      
      if (!isValid) {
        console.error("Error: Contraseña incorrecta");
        await this._handleFailedLogin(user);
        throw new Error("Contraseña incorrecta");
      }

      // Registrar login exitoso
      await this.authRepository.saveLoginAttempt(
        username,
        true,
        requestInfo.ip || "",
        requestInfo.userAgent || ""
      );

      await this._handleSuccessfulLogin(user);

      const token = this._generateToken(user, rememberMe);

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
      console.log("Inicio del proceso de registro");
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
    console.log("Manejando fallo de login para el usuario:", user.username);
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    if (user.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + this.LOCK_TIME);
      user.lockUntil = createStructuredDate(lockUntil);
      await this.userRepository.update(user._id.toString(), user); // Asegurarse de que _id es una cadena
      throw new Error(
        `Cuenta bloqueada temporalmente hasta ${lockUntil.toLocaleString()}`
      );
    }

    await this.userRepository.update(user._id.toString(), user); // Asegurarse de que _id es una cadena
  }

  async _handleSuccessfulLogin(user) {
    console.log("Manejando éxito de login para el usuario:", user.username);
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = createStructuredDate(new Date());
    await this.userRepository.update(user._id.toString(), user); // Asegurarse de que _id es una cadena
  }
}

export const authService = new AuthService();