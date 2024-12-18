import config from '../config/env.cfg';
import { _getHeaders, handleUnauthorizedError } from './utils';

export const loginService = async (credentials) => {
  try {
    const response = await fetch(`${config.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    handleUnauthorizedError(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el inicio de sesión');
    }

    const data = await response.json();
    return {
      user: data.user,
      token: data.token
    };
  } catch (error) {
    console.error('Error en loginService:', error);
    throw error;
  }
};

export const logoutService = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: _getHeaders()
    });

    if (!response.ok) {
      throw new Error('Error al cerrar sesión');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en logoutService:', error);
    throw error;
  }
}; 