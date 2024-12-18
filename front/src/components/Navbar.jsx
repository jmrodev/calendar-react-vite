import { useDispatch, useSelector } from 'react-redux';
import { logoutAsync } from '../redux/slices/authSlice';
import showToast from "../utils/toastUtils";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync());
      showToast("Sesión cerrada exitosamente", "success");
    } catch (error) {
      showToast("Error al cerrar sesión", "error");
    }
  };

  return (
    <nav>
      {/* ... otros elementos del navbar ... */}
      {isAuthenticated && (
        <button onClick={handleLogout}>Cerrar Sesión</button>
      )}
    </nav>
  );
};

export default Navbar; 