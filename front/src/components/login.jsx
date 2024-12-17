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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      showToast("Inicio de sesión exitoso", "success");
    } catch (error) {
      showToast("Error al iniciar sesión: " + error.message, "error");
    }
  };

  const [modalIsOpen, setModalIsOpen] = useState(true);

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
        <form
          onSubmit={async (e) => {
            await handleSubmit(e);
            handleCloseModal();
          }}
        >
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
          />
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </Modal>
  );
};
