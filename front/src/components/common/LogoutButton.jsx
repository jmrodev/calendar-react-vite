import { useAuth } from '../../hooks/useAuth';
import showToast from '../../utils/toastUtils';

export const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    showToast('Sesión cerrada exitosamente', 'success');
  };

  return (
    <li>
      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
    </li>
  );
}; 