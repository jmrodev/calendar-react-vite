import { useEffect } from 'react'; // Unused import
import { getCurrentUserAsync } from '../redux/slices/authSlice';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const ProtectedLayout = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector(state => state.auth);

  useEffect(() => {
    if (!user && !isLoading) {
      dispatch(getCurrentUserAsync());
    }
  }, [dispatch, isLoading, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;