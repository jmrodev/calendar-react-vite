import { useState } from "react";
import config from "../config/env.cfg";
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../redux/actions/authActions';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

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
        const { token } = data;
        localStorage.setItem("jwt", token);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setIsAuthenticated(false);
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

  const logout = () => {
    localStorage.removeItem("jwt");
    dispatch(loginFailure(null));
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout,
    register,
    refreshToken, 
  };
};