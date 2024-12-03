import jwt from 'jsonwebtoken';
import { authToken } from './authToken'; // Asegúrate de que la ruta sea correcta

describe('authToken middleware', () => {
  it('should log the user when token is valid', async () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET); // Genera un token válido
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    console.log = jest.fn(); // Mock de console.log

    await authToken(req, res, next);

    expect(console.log).toHaveBeenCalledWith('Authorization header:', req.headers['authorization']);
    expect(console.log).toHaveBeenCalledWith('Extracted token:', token);
    expect(next).toHaveBeenCalled(); // Verifica que se llame a next()
  });

  // ... Aquí puedes agregar más pruebas para otros casos ...
}); 