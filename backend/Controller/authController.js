import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authConfig } from '../config/auth.config.js';
import { UserSchema } from '../Models/UserSchema.js';
import rateLimit from 'express-rate-limit';
import { newUserId } from '../Utils/createId.js';
import { 
    verifyPassword, 
    hashPassword, 
    findUserByUsername,
    createUser
} from '../Utils/authUtils.js';

// Rate limiting middleware
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por ventana
  message: { error: 'Demasiados intentos de inicio de sesión. Por favor, inténtelo más tarde.' }
});

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validación de entrada
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'El usuario y la contraseña son requeridos' 
            });
        }
        
        // Búsqueda de usuario
        const user = findUserByUsername(username);
        
        if (!user) {
            // Usar bcrypt.compare con hash ficticio para prevenir ataques de tiempo
            await bcrypt.compare(password, '$2b$10$' + 'a'.repeat(53));
            return res.status(401).json({ 
                error: 'Credenciales inválidas' 
            });
        }
        
        // Verificar contraseña
        const isPasswordValid = await verifyPassword(user, password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'Credenciales inválidas' 
            });
        }
        
        // Generar JWT con payload mínimo
        const token = jwt.sign(
            { 
                sub: user._id,
                role: user.role 
            },
            authConfig.jwtSecret,
            { 
                expiresIn: authConfig.jwtExpiration,
                algorithm: 'HS256'
            }
        );
        
        // Establecer JWT en cookie HTTP-only
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hora
        });
        
        res.json({ 
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error de inicio de sesión:', error);
        res.status(500).json({ 
            error: 'Ocurrió un error durante el inicio de sesión' 
        });
    }
};

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validación de entrada
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'El usuario y la contraseña son requeridos' 
            });
        }
        
        // Validar si el usuario ya existe
        const existingUser = findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ 
                error: 'El usuario ya existe' 
            });
        }
        
        // Preparar datos de usuario
        const userData = {
            _id: newUserId(), 
            username, 
            password,
            role: 'user'
        };
                
        // Hashear la contraseña
        const userDataWithHashedPassword = await hashPassword(userData);
        
        
        // Crear usuario
        const savedUser = createUser(userDataWithHashedPassword);
        
        
        res.json({ 
            success: true,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                role: savedUser.role
            }
        });
    } catch (error) {
        console.error('Error de registro:', error);
        res.status(500).json({ 
            error: 'Ocurrió un error durante el registro' 
        });
    }
};