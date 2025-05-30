import React, { useState } from "react";
import "./Login.css"; // Archivo de estilos

function Login() {
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica de autenticación
        console.log("Usuario:", usuario, "Contraseña:", contraseña);
    };

    return (
        <div className="login-container">
            <h1 className="titulo">Sembrar, clima y calendario al alcance de nuestra tierra</h1>
            <div className="login-content">
                <div className="login-image">
                    <img src="/logo.png" alt="Logo" />
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
                        />

                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            placeholder="Ingrese su contraseña"
                        />

                        <button type="submit">Ingresar</button>
                        <button className="register-btn">Registrarse</button>
                    </form>
                    <p className="forgot-password">¿Olvidaste tu contraseña?</p>
                </div>
            </div>
        </div>
    );
}

export default Login;