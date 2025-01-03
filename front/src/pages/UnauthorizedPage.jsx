import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/unauthorizedPage.css';

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1>Acceso No Autorizado</h1>
        <p>No tiene los permisos necesarios para acceder a esta página.</p>
        <Link to="/dashboard" className="back-link">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 