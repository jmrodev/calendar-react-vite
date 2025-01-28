import dotenv from "dotenv";
dotenv.config();

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
  saltRounds: parseInt(process.env.SALT_ROUNDS),
};

export const AUTH_CONFIG = {
  PASSWORD_MIN_LENGTH: process.env.PASSWORD_MIN_LENGTH || 8,
  LOGIN_MAX_ATTEMPTS: process.env.LOGIN_MAX_ATTEMPTS || 5,
  LOGIN_LOCK_TIME: process.env.LOGIN_LOCK_TIME || 1800000,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  TOKEN_EXPIRATION: {
    ACCESS: '1h',
    REFRESH: '7d'
  }
};

export const PASSWORD_REQUIREMENTS = {
  minLength: AUTH_CONFIG.PASSWORD_MIN_LENGTH,
  requirements: [
    'Al menos una letra mayúscula',
    'Al menos una letra minúscula',
    'Al menos un número',
    'Al menos un carácter especial (@$!%*?&)',
    `Mínimo ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} caracteres`
  ]
};
