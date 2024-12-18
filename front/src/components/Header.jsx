import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth";

export const Header = () => {
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userName = useSelector((state) => state.auth.userName);

  const handleLogout = () => {
    logout();
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <a href="/">Inicio</a>
          </li>
          {isLoggedIn ? (
            <>
              <li>Bienvenido, {userName}</li>
              <li>
                <button onClick={handleLogout}>Cerrar sesión</button>
              </li>
            </>
          ) : (
            <li>
              <a href="/login">Iniciar sesión</a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
