// Importación de módulos necesarios
import React, { useState } from "react"; // Hook para manejar el estado del formulario
import { useNavigate } from "react-router-dom"; // Hook para la navegación entre páginas
import "./Login.css"; // Archivo de estilos CSS
import axios from 'axios'; // Librería para realizar solicitudes HTTP

// Definición del componente Login
function Login() {
  // Estados para manejar el ingreso de usuario y contraseña
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Inicialización de la función de navegación

  // Función para manejar el envío del formulario de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    setError(""); // Resetea el mensaje de error

    try {
      console.log("🧾 Enviando datos:", { username: usuario, password: contraseña });

      // Enviar credenciales al backend para autenticación
      const res = await axios.post('http://localhost:3000/api/usuario/login', {
        username: usuario,
        password: contraseña
      });

      // Guardar datos en localStorage tras inicio de sesión exitoso
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("perfil", res.data.perfil);
      localStorage.setItem("username", res.data.username);

      // Verificar permisos y redirigir al usuario según su perfil
      console.log("Perfil recibido:", res.data.perfil);
      if (res.data.perfil.toLowerCase() === "administrador") {
        navigate("/dashboard");
      } else {
        alert("⚠️ No tienes permisos para ingresar."); // Mensaje de acceso denegado
        localStorage.clear(); // Limpia los datos en caso de acceso restringido
      }
    } catch (err) {
      console.error("❌ Error en frontend login:", err);

      // Manejo de errores y actualización del estado de error
      setError(err.response?.data?.error || "❌ Error al iniciar sesión");
    }
  };

  // Función para redirigir a la página de registro de usuario
  const handleRegistro = () => {
    navigate("/registro-persona");
  };

  return (
    <div className="login-container">
      {/* Título de la aplicación */}
      <h1 className="titulo">
        Sembrar, clima y calendario al alcance de nuestra tierra
      </h1>

      {/* Contenedor principal del formulario */}
      <div className="login-content">
        {/* Sección de imagen/logo */}
        <div className="login-image">
          <img src="/logo.png" alt="logo" />
        </div>

        {/* Sección del formulario de inicio de sesión */}
        <div className="login-form">
          <h2>Iniciar Sesión</h2>

          {/* Mostrar mensaje de error si existe */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Campo de entrada para usuario */}
            <label>Usuario:</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingrese su usuario"
              required
            />

            {/* Campo de entrada para contraseña */}
            <label>Contraseña:</label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />

            {/* Botón para iniciar sesión */}
            <button type="submit">Ingresar</button>

            {/* Botón para redirigir al registro de usuario */}
            <button
              type="button"
              className="register-btn"
              onClick={handleRegistro}
            >
              Registrarse
            </button>
          </form>

          {/* Enlace para recuperación de contraseña */}
          <p
            className="forgot-password"
            onClick={() => navigate("/recuperar-clave")}
          >
            ¿Olvidaste tu contraseña?
          </p>
        </div>
      </div>
    </div>
  );
}

// Exportación del componente para su uso en otras partes de la aplicación
export default Login;