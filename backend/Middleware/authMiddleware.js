import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {

    // --------------------------------------------
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    // if (!token) {
    //     return res.status(401).json({ error: 'No token provided' });
    // }
    // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //     if (err) {
    //         return res.status(403).json({ error: 'Invalid or expired token' });
    //     }
    //     req.user = user;
    //     next();
    // });

    // Otra forma de hacerlo
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
}