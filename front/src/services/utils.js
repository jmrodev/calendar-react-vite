import Cookies from 'js-cookie';
import { store } from '../redux/store';
import { logout } from '../redux/actions/authActions';

export const _getHeaders = () => {
    const token = localStorage.getItem('jwt') || Cookies.get('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const _handleError = (method, error) => {
    console.error(`Error in ${method}:`, error);
    throw new Error(error.message || `Error en ${method}: Ocurrió un error inesperado`, error);
};

export const handleUnauthorizedError = (response) => {
    if (response.status === 401) {
        localStorage.removeItem('jwt');
        store.dispatch(logout());
        window.location.href = '/login';
        throw new Error('Sesión expirada');
    }
    return response;
};