import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Usuario:", usuario, "Contraseña:", contraseña);
    // Aquí iría la lógica real de autenticación (más adelante)
  };

  const handleRegistro = () => {
    navigate("/registro-persona");
  };

  return (
    <div className="login-container">
      <h1 className="titulo">
        Sembrar, clima y calendario al alcance de nuestra tierra
      </h1>
      <div className="login-content">
        <div className="login-image">
          <img src="/logo.png" alt="logo" />
        </div>
        <div className="login-form">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <label>Usuario:</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingrese su usuario"
              required
            />

            <label>Contraseña:</label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />

            <button type="submit">Ingresar</button>
            <button
              type="button"
              className="register-btn"
              onClick={handleRegistro}
            >
              Registrarse
            </button>
          </form>
          <p className="forgot-password">¿Olvidaste tu contraseña?</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
