import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import showToast from "../utils/toastUtils";
import Modal from "react-modal";
import './styles/login.css';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError("Por favor, ingrese usuario y contraseña");
      showToast("Por favor, ingrese usuario y contraseña", "error");
      return;
    }

    try {
      const result = await login(credentials);
      
      if (result.success) {
        showToast("Inicio de sesión exitoso", "success");
        navigate('/');
        setModalIsOpen(false);
      } else {
        setError(result.error);
        showToast(result.error, "error");
      }
    } catch (error) {
      setError("Error al iniciar sesión");
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