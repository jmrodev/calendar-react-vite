import { store } from '../redux/store';
import { logoutAsync } from '../redux/slices/authSlice';


export const _getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const _handleError = (method, error) => {
    console.error(`Error in ${method}:`, error);
    throw new Error(error.message || `Error en ${method}: Ocurrió un error inesperado`, error);
};

export const handleUnauthorizedError = (response) => {
    if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    }
};

export const handleApiError = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la solicitud');
    }
    return response.json();
};

export const formatApiUrl = (endpoint) => {
    const baseUrl = (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) || 'http://localhost:3002/api';
    return `${baseUrl}${endpoint}`;
};

export const handleNetworkError = (error) => {
    if (!navigator.onLine) {
        throw new Error('No hay conexión a internet');
    }
    throw error;
};

export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await requestFn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
};

export const validateResponse = (data, schema) => {
    const errors = {};
    Object.keys(schema).forEach(key => {
        if (schema[key].required && !data[key]) {
            errors[key] = `El campo ${key} es requerido`;
        }
        if (schema[key].validate && data[key]) {
            const error = schema[key].validate(data[key]);
            if (error) errors[key] = error;
        }
    });
    return errors;
};

export const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

export const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};