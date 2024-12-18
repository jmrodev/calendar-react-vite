import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../redux/slices/authSlice';
import showToast from "../utils/toastUtils";
import Modal from "react-modal";
import './styles/login.css';
import { useNavigate } from 'react-router-dom';

export const Login = ({ onClose }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      showToast("Por favor, ingrese usuario y contraseña", "error");
      return;
    }

    try {
      await dispatch(loginAsync(credentials));
      showToast("Inicio de sesión exitoso", "success");
      navigate('/');
      setModalIsOpen(false);
    } catch (error) {
      showToast("Error al iniciar sesión", "error");
    }
  };

  return (
    <Modal
      className="modal"
      isOpen={modalIsOpen}
      onRequestClose={() => navigate('/')}
      ariaHideApp={false}
    >
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            onChange={(e) => setCredentials(prev => ({...prev, username: e.target.value}))}
            value={credentials.username}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
            value={credentials.password}
          />
          {error && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              {error}
            </div>
          )}
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </Modal>
  );
};