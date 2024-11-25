import jwt from 'jsonwebtoken';

const secretKey = 'tu_clave_secreta'; // Cambia esto por una clave más segura

export const login = (req, res) => {
    const { username, password } = req.body;

    // Aquí deberías verificar el usuario y la contraseña
    const user = { username, role: 'user' }; // Cambia esto según tu lógica

    const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    res.json({ token });
}; 