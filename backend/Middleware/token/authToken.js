import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const authToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  // console.log('Authorization header:', req.headers['authorization']);
  // console.log('Extracted token:', token);
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    // console.log('Verifying token...');
    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          // console.error('Token verification error:', err.message);
          return reject(err);
        }
        // console.log('Token verified successfully:', user);
        resolve(user);
      });
    });
    req.user = user;
    next();
  } catch (err) {
    console.error('Unexpected error:', err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Forbidden', message: 'JWT malformed' });
    }
    return res.status(403).json({ error: 'Forbidden', message: err.message });
  }
};
