import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { LogoutButton } from './LogoutButton';

export const Header = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <header>
      <nav>
        <ul>
          <li>
            <a href="/">Inicio</a>
          </li>
          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <Link to="/login">Iniciar Sesión</Link>
          )}
        </ul>
      </nav>
    </header>
  );
};
