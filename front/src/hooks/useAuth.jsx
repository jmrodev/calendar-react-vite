import { useState } from "react";

export const  useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const login = async (credentials) => {    
        console.log(credentials);
            
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
            setIsAuthenticated(false);
            const { error } = await response.json();
            alert(error);
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

