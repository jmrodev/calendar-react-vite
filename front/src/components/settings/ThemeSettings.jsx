import { useTheme } from '../../context/ThemeContext';
import '../../styles/components/settings/themeSettings.css';

const ThemeSettings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-settings">
      <h3>Configuración del Tema</h3>
      <div className="theme-options">
        <label className={`theme-option ${theme === 'light' ? 'active' : ''}`}>
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === 'light'}
            onChange={() => theme !== 'light' && toggleTheme()}
          />
          <span className="theme-icon">☀️</span>
          <span className="theme-label">Claro</span>
        </label>
        <label className={`theme-option ${theme === 'dark' ? 'active' : ''}`}>
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={() => theme !== 'dark' && toggleTheme()}
          />
          <span className="theme-icon">🌙</span>
          <span className="theme-label">Oscuro</span>
        </label>
      </div>
    </div>
  );
};

export default ThemeSettings; 