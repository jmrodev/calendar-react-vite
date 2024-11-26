import dotenv from 'dotenv';
dotenv.config();

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
  saltRounds: parseInt(process.env.SALT_ROUNDS)
};