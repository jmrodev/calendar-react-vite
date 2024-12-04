import { useState } from "react";

const  useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const login = async (credentials) => {
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('jwt', token);
            setIsAuthenticated(true);
        } else {
            // Manejar error de autenticación
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        login,
        logout,
    };
};

export default useAuth;