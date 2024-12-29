import config from '../config/env.cfg';
import { _getHeaders, handleUnauthorizedError, handleApiError } from './utils';

export const login = async (credentials) => {
  try {
    const response = await fetch(`${config.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${config.baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: _getHeaders()
    });

    handleUnauthorizedError(response);
    await handleApiError(response);
    
    localStorage.removeItem('authToken');
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${config.baseUrl}/auth/me`, {
      headers: _getHeaders()
    });

    handleUnauthorizedError(response);
    return await handleApiError(response);
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (updates) => {
  try {
    const response = await fetch(`${config.baseUrl}/auth/profile`, {
      method: 'PUT',
      headers: _getHeaders(),
      body: JSON.stringify(updates)
    });

    handleUnauthorizedError(response);
    return await handleApiError(response);
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (passwords) => {
  try {
    const response = await fetch(`${config.baseUrl}/auth/change-password`, {
      method: 'POST',
      headers: _getHeaders(),
      body: JSON.stringify(passwords)
    });

    handleUnauthorizedError(response);
    return await handleApiError(response);
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await fetch(`${config.baseUrl}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    return await handleApiError(response);
  } catch (error) {
    throw error;
  }
}; 