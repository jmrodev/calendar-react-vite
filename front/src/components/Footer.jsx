import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Sistema de Citas</h3>
          <p>Gestiona tus citas médicas de manera fácil y eficiente.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Enlaces Útiles</h3>
          <ul className="footer-links">
            <li>
              <Link to="/about">Acerca de</Link>
            </li>
            <li>
              <Link to="/contact">Contacto</Link>
            </li>
            <li>
              <Link to="/privacy">Privacidad</Link>
            </li>
            <li>
              <Link to="/terms">Términos y Condiciones</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contacto</h3>
          <p>Email: info@sistemacitas.com</p>
          <p>Teléfono: (123) 456-7890</p>
          <p>Dirección: Calle Principal #123</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Sistema de Citas. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
