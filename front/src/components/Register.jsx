import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const Register = () => {
  const { register } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    register(credentials);
  };
  return (
    <div>
      <h1>Register</h1>
      <form>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
        />
        <button onClick={handleSubmit} type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
};
