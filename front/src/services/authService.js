import config from '../config/env.cfg.js';

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${config.baseUrl}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Add this for cookies
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const register = async (userData) => {
  const response = await fetch(`${config.baseUrl}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrar usuario');
  }

  return await response.json();
};

export const logout = async () => {
  const response = await fetch(`${config.baseUrl}/users/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al cerrar sesión');
  }

  return true;
};

export const getCurrentUser = async () => {
  const response = await fetch(`${config.baseUrl}/users/current`, {
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Error al obtener usuario actual');
  }

  return await response.json();
};