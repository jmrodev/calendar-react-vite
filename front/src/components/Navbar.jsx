import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAsync } from '../redux/slices/authSlice';
import showToast from '../utils/toastUtils';
import './styles/navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync());
      showToast('Sesión cerrada exitosamente', 'success');
      navigate('/login');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">Sistema de Citas</Link>
      </div>

      <div className="navbar-menu">
        <Link to="/appointments" className="nav-link">
          Citas
        </Link>
        {user.role === 'admin' && (
          <Link to="/users" className="nav-link">
            Usuarios
          </Link>
        )}
        <Link to="/profile" className="nav-link">
          Perfil
        </Link>
      </div>

      <div className="navbar-end">
        <span className="user-info">
          {user.fullName} ({user.role})
        </span>
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 