import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../styles/layouts/footer.css';

export const Footer = () => {
  return (
    <footer className="footer bg-dark text-light">
      <div className="container">
        <div className="footer-content grid">
          <div className="footer-section">
            <h3 className="mb-3">Sistema de Citas</h3>
            <p className="mb-3">Gestiona tus citas médicas de manera fácil y eficiente.</p>
            <div className="social-links d-flex">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="link">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="link">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="link">
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="mb-3">Enlaces Útiles</h3>
            <ul className="footer-links">
              <li className="mb-2">
                <Link to="/about" className="link">Acerca de</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="link">Contacto</Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="link">Privacidad</Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="link">Términos y Condiciones</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="mb-3">Contacto</h3>
            <p className="mb-2">Email: info@sistemacitas.com</p>
            <p className="mb-2">Teléfono: (123) 456-7890</p>
            <p className="mb-2">Dirección: Calle Principal #123</p>
          </div>
        </div>

        <div className="footer-bottom text-center mt-4 pt-4 border-top">
          <p>&copy; {new Date().getFullYear()} Sistema de Citas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};


