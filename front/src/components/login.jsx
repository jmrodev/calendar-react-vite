import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import showToast from "../utils/toastUtils";
import Modal from "react-modal";
import './styles/login.css';

export const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError("Por favor, ingrese usuario y contraseña");
      return;
    }

    try {
      const result = await login(credentials);
      
      if (result.error) {
        setError(result.error);
        showToast(`Error al iniciar sesión: ${result.error}`, "error");
      } else {
        showToast("Inicio de sesión exitoso", "success");
        handleCloseModal();
      }
    } catch (error) {
      setError(error.message || "Error desconocido al iniciar sesión");
      showToast(`Error al iniciar sesión: ${error.message}`, "error");
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Modal
      className="modal"
      isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      ariaHideApp={false}
    >
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            onChange={handleChange}
            value={credentials.username}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            value={credentials.password}
          />
          {error && (
            <div 
              style={{ 
                color: 'red', 
                marginBottom: '10px',
                padding: '5px',
                backgroundColor: '#ffeeee',
                borderRadius: '4px'
              }}
            >
              {error}
            </div>
          )}
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </Modal>
  );
};