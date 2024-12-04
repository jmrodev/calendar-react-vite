import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

export const Login = () => {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(credentials);
    };

    return (
        <div>
            <h1>Login</h1>
            <form>
                <input type="text" name="username" placeholder="Usuario" onChange={handleChange} />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
                <button onClick={handleSubmit} type="submit">Iniciar sesión</button>
            </form>
        </div>
    );
}