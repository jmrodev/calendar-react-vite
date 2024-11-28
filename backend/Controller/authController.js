import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authConfig } from '../config/auth.config.js';
import { UserSchema } from '../Models/UserSchema.js';
import { newUserId } from '../Utils/createId.js';
import { standardizeDate } from '../Utils/dateUtils.js';
import { 
    verifyPassword, 
    hashPassword, 
    findUserByUsername
} from '../Utils/authUtils.js';



export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'El usuario y la contraseña son requeridos' 
            });
        }
        
        const user = await findUserByUsername(username);
        
        if (!user) {
            // Constant-time comparison to prevent timing attacks
            await bcrypt.compare(password, '$2b$10$' + 'a'.repeat(53));
            return res.status(401).json({ 
                error: 'Credenciales inválidas' 
            });
        }
        
        const isPasswordValid = await verifyPassword(user, password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'Credenciales inválidas' 
            });
        }
        
        // Update last login with standardized date
        user.lastLogin = standardizeDate(new Date());
        console.log('Último inicio de sesión:', user.lastLogin);
        
        await user.save();
        
        const token = jwt.sign(
            { 
                sub: user._id,
                role: user.role,
                username: user.username
            },
            authConfig.jwtSecret,
            { 
                expiresIn: authConfig.jwtExpiration,
                algorithm: 'HS256'
            }
        );
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 
        });
        
        res.json({ 
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                lastLogin: standardizeDate(user.lastLogin)
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
        const { username, password, role } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'El usuario y la contraseña son requeridos' 
            });
        }
        
        const existingUser = await findUserByUsername(username);
        
        if (existingUser) {
            return res.status(400).json({ 
                error: 'El usuario ya existe' 
            });
        }
        
        // Preparar los datos del usuario
        const userData = {
            _id: newUserId(), 
            username, 
            password,
            role: role || 'user',
            createdAt: standardizeDate(new Date()),
            lastLogin: standardizeDate(new Date())
        };
        
        // Hashear la contraseña antes de guardar
        const hashedUserData = await hashPassword(userData);
        
        // Crear y guardar el nuevo usuario
        const newUser = await UserSchema.create(hashedUserData).save();
        console.log('Nuevo usuario:', newUser);
        
        res.status(201).json({ 
            success: true,
            user: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role,
                createdAt: standardizeDate(newUser.createdAt)
            }
        });
    } catch (error) {
        console.error('Error de registro:', error);
        res.status(500).json({ 
            error: 'Ocurrió un error durante el registro' 
        });
    }
};