import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import showToast from './toastUtils';

export const handleUnauthorizedError = (response) => {
  if (response.status === 401 || response.status === 403) {
    store.dispatch(logout());
    showToast('Su sesión ha expirado, por favor inicie sesión nuevamente', 'warning');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }
};

export const _getHeaders = () => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    store.dispatch(logout());
    showToast('Su sesión ha expirado, por favor inicie sesión nuevamente', 'warning');
    window.location.href = '/login';
    throw new Error('No hay token de autenticación');
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};
