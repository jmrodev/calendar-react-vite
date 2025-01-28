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

  async login(username, password, rememberMe = false) {
    try {
      if (!username || !password) {
        throw new Error("Usuario y contraseña son requeridos");
      }

      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        await this.authRepository.saveLoginAttempt(username, false);
        throw new Error("Usuario no encontrado");
      }

      // Verificar bloqueo temporal
      if (user.lockUntil) {
        const lockUntil = new Date(user.lockUntil);
        if (lockUntil > new Date()) {
          const minutesLeft = Math.ceil((lockUntil - new Date()) / (60 * 1000));
          throw new Error(`Cuenta bloqueada temporalmente. Intente nuevamente en ${minutesLeft} minutos`);
        }
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        await this._handleFailedLogin(user);
        throw new Error("Contraseña incorrecta");
      }

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
        throw new Error("Todos los campos son requeridos");
      }

      if (password.length < process.env.PASSWORD_MIN_LENGTH) {
        throw new Error(`La contraseña debe tener al menos ${process.env.PASSWORD_MIN_LENGTH} caracteres`);
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error("La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales");
      }

      const existingUser = await this.userRepository.findByUsername(username);
      if (existingUser) {
        throw new Error("El usuario ya existe");
      }

      const newUser = await this.userRepository.create({
        username,
        password,
        role
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
      throw new Error(`Error en registro: ${error.message}`);
    }
  }

  // Métodos privados auxiliares
  _generateToken(user, rememberMe) {
    return jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? '7d' : '1h' }
    );
  }

  async _handleFailedLogin(user) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    
    if (user.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + this.LOCK_TIME);
      user.lockUntil = createStructuredDate(lockUntil);
      await this.userRepository.update(user._id, user);
      throw new Error(`Cuenta bloqueada temporalmente hasta ${lockUntil.toLocaleString()}`);
    }
    
    await this.authRepository.saveLoginAttempt(user.username, false);
  }

  async _handleSuccessfulLogin(user) {
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = createStructuredDate(new Date());
    await this.userRepository.update(user._id, user);
    await this.authRepository.saveLoginAttempt(user.username, true);
  }

  // Mover la lógica de loginUtils.js aquí
  async _checkLoginAttempts(user) {
    if (user.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + this.LOCK_TIME);
      user.lockUntil = createStructuredDate(lockUntil);
      await this.userRepository.update(user._id, user);
      throw new Error(`Cuenta bloqueada temporalmente hasta ${lockUntil.toLocaleString()}`);
    }
  }
}

export const authService = new AuthService();
