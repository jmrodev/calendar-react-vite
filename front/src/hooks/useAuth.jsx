import { useState } from "react";
import config from "../config/env.cfg";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    const response = await fetch(config.url_login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem("jwt", token);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      const { error } = await response.json();
      alert(error);
    }
  };

  const register = async (credentials) => {
    const response = await fetch(config.url_register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem("jwt", token);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout,
    register,
  };
};
