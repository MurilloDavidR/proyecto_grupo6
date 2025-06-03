import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: "", perfil: "" });
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [debugMsg, setDebugMsg] = useState("Renderizando Dashboard...");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setDebugMsg("Ejecutando useEffect en Dashboard...");
    const token = localStorage.getItem("token");

    if (!token) {
      alert("⛔ No has iniciado sesión");
      navigate("/login");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.perfil.toLowerCase() !== "administrador") {
      alert("⛔ Acceso denegado");
      navigate("/login");
      return;
    }

    setUserData({ username: payload.username || "", perfil: payload.perfil || "" });
    setDebugMsg("Token válido, obteniendo usuarios...");

    // Obtener usuarios con perfil desde la nueva ruta
    axios
      .get("http://127.0.0.1:3000/api/perfil/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsuarios(response.data);
        setDebugMsg("Usuarios obtenidos correctamente.");
      })
      .catch((error) => {
        // Mejor manejo de error para no mostrar mensaje 403
        if (error.response && error.response.status === 403) {
          setError("");
          setDebugMsg("Acceso denegado para obtener usuarios.");
        } else {
          setError("Error al obtener usuarios: " + (error.message || ""));
          setDebugMsg("Error al obtener usuarios: " + (error.message || ""));
        }
      });
  }, [navigate]);

  return (
    <>
      <div style={{ backgroundColor: "#013220", color: "black", minHeight: "100vh", padding: "20px" }}>
        <h2>Bienvenido, {userData.username}</h2>
        <p>Perfil: {userData.perfil}</p>
        <p style={{ color: "black", backgroundColor: "#006400", padding: "5px" }}>{debugMsg}</p>

        <h3>Usuarios registrados</h3>
        {error && <p style={{ color: "black", backgroundColor: "#8B0000" }}>{error}</p>}
        {mensaje && <p style={{ color: "black", backgroundColor: "#90EE90" }}>{mensaje}</p>}

        <input
          type="text"
          placeholder="Buscar usuario"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "10px", padding: "5px", width: "80%" }}
        />
        <button
          onClick={() => setSearchTerm(searchTerm)}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          Buscar
        </button>
        <ul>
          {usuarios
            .filter((usuario) =>
              usuario.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((usuario) => (
              <li key={usuario.id_usuario}>
                {usuario.username} - Perfil: {usuario.perfil}
              </li>
            ))}
        </ul>
        <hr />
      <button onClick={() => window.location.href = '/registro-perfil'} style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}>
        Gestionar Perfiles
      </button>
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }} style={{ marginTop: '20px', marginLeft: '10px', padding: '10px', fontSize: '16px' }}>
        Cerrar Sesión
      </button>
    </div>
  </>
  );
}

export default Dashboard;
