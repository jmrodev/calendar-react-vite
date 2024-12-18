import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { logoutAsync } from '../redux/slices/authSlice';
import showToast from "../utils/toastUtils";
import './styles/header.css';

export const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync());
      showToast("Sesión cerrada exitosamente", "success");
    } catch (error) {
      showToast("Error al cerrar sesión", "error");
    }
  };

  return (
    <header>
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">Sistema de Citas</Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/appointments">Citas</Link>
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <li>
              <Link to="/login" className="login-link">
                Iniciar Sesión
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
