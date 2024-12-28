import store from '../redux/store';
import { logoutAsync } from '../redux/slices/authSlice';

export const _getHeaders = () => {
    const state = store.getState();
    const token = state.auth.token || localStorage.getItem('authToken');
    
    console.log('Current token:', token);
    
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const _handleError = (method, error) => {
    console.error(`Error in ${method}:`, error);
    throw new Error(error.message || `Error en ${method}: Ocurrió un error inesperado`, error);
};

export const handleUnauthorizedError = async (response) => {
    if (response.status === 401) {
        localStorage.removeItem('authToken');
        await store.dispatch(logoutAsync());
        window.location.href = '/login';
        throw new Error('Sesión expirada');
    }
    return response;
};