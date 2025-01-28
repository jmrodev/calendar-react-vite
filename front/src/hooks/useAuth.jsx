import { useState, useEffect } from "react";
import config from "../config/env.cfg";
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const login = async (credentials) => {
    try {
      const response = await fetch(config.url_login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data;
        localStorage.setItem("jwt", token);
        dispatch(loginSuccess(user));
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.error || 'Error de inicio de sesión'
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: 'No se pudo conectar al servidor'
      };
    }
  };

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`${config.baseUrl}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { token: newToken } = await response.json();
        localStorage.setItem("jwt", newToken);
        return { 
          success: true, 
          token: newToken 
        }; 
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'No se pudo refrescar el token'
        };
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      return { 
        success: false, 
        error: 'Error de conexión al refrescar token'
      };
    }
  };

  const register = async (credentials) => {
    try {
      const response = await fetch(config.url_register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;
        localStorage.setItem("jwt", token);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.error || 'Error de registro'
        };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { 
        success: false, 
        error: 'No se pudo conectar al servidor'
      };
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("jwt");
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      handleLogout();
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        handleLogout();
        return false;
      }
    } catch (error) {
      handleLogout();
      return false;
    }
    return true;
  };

  return {
    isAuthenticated,
    login,
    logout: handleLogout,
    register,
    refreshToken, 
    checkAuthStatus,
  };
};