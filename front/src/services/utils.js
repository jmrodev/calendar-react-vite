import Cookies from 'js-cookie';

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