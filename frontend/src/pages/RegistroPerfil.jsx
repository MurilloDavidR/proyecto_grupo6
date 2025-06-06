import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RegistroPerfil.css";

function RegistroPerfil() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: "", perfil: "" });
  const [usuarios, setUsuarios] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [selectedPerfilId, setSelectedPerfilId] = useState('');
  const [errorUsuarios, setErrorUsuarios] = useState("");
  const [mensajeUsuarios, setMensajeUsuarios] = useState("");
  const [errorPerfiles, setErrorPerfiles] = useState("");
  const [mensajePerfiles, setMensajePerfiles] = useState("");
  const [debugMsg, setDebugMsg] = useState("Renderizando RegistroPerfil...");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("usuarios");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let token = localStorage.getItem("token");
    console.log('Frontend - Token obtenido:', token);

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
    setDebugMsg("Token válido, obteniendo usuarios y perfiles...");

    axios.get("/api/perfil/usuarios", {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    })
    .then((response) => {
      setUsuarios(response.data);
      setDebugMsg("Usuarios obtenidos correctamente.");
    })
    .catch((error) => {
      const errorMsg = error.response?.status === 403 
        ? "Acceso denegado para obtener usuarios."
        : "Error al obtener usuarios: " + (error.message || "");
      setErrorUsuarios(errorMsg);
      setDebugMsg(errorMsg);
    });

    axios.get('/api/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      if (Array.isArray(response.data)) {
        setPerfiles(response.data);
      } else {
        setPerfiles([]);
        setErrorPerfiles('Respuesta inesperada del servidor');
      }
    })
    .catch(() => setErrorPerfiles('Error al obtener perfiles'))
    .finally(() => setLoading(false));
  }, [navigate]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSelectChange = (e) => {
    setSelectedPerfilId(e.target.value);
    setMensajePerfiles('');
    setErrorPerfiles('');
    setMensajeUsuarios('');
    setErrorUsuarios('');
  };

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAction = async (action) => {
    if (!selectedPerfilId) {
      setErrorPerfiles(`Seleccione un usuario para ${action}`);
      return;
    }

    const usuario = usuarios.find(u => u.id_usuario.toString() === selectedPerfilId);
    if (!usuario) {
      setErrorPerfiles('Usuario no encontrado');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      let response;
      switch (action) {
        case 'inhabilitar':
          response = await axios.put(`/api/usuario/inhabilitar/${selectedPerfilId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMensajePerfiles('✅ Usuario inhabilitado correctamente');
          break;
        case 'habilitar':
          response = await axios.put(`/api/usuario/habilitar/${selectedPerfilId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMensajePerfiles('✅ Usuario habilitado correctamente');
          break;
        case 'eliminar':
          if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;
          response = await axios.delete(`/api/usuario/${selectedPerfilId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMensajePerfiles('Usuario eliminado correctamente');
          break;
        case 'editar':
          const nuevoNombre = prompt('Ingrese el nuevo nombre de usuario:', usuario.username);
          if (!nuevoNombre?.trim()) {
            setErrorPerfiles('Nombre inválido');
            return;
          }
          const perfilResponse = await axios.get('/api/perfil', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const perfilEncontrado = perfilResponse.data.find(
            p => p.nombre.toLowerCase() === usuario.perfil.toLowerCase()
          );
          if (!perfilEncontrado) {
            setErrorPerfiles('Error: No se pudo encontrar el perfil del usuario');
            return;
          }
          response = await axios.put(`/api/usuario/${selectedPerfilId}`, 
            { username: nuevoNombre.trim(), id_perfil: perfilEncontrado.id_perfil },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMensajePerfiles('Usuario actualizado correctamente');
          break;
      }

      // Actualizar lista de usuarios
      const usuariosResponse = await axios.get("/api/perfil/usuarios", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(usuariosResponse.data);
      setSelectedPerfilId('');
    } catch (error) {
      setErrorPerfiles(`Error al ${action} usuario: ${error.response?.data?.error || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="registro-perfil-container">
        <div className="header-section">
          <h2 className="welcome-text">Cargando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-perfil-container">
      <div className="header-section">
        <h2 className="welcome-text">¡Bienvenido, {userData.username}!</h2>
        <p className="profile-text">Perfil: {userData.perfil}</p>
      </div>

      {debugMsg && (
        <div className="debug-message">{debugMsg}</div>
      )}

      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "usuarios" ? "active" : ""}`}
          onClick={() => setActiveTab("usuarios")}
        >
          Usuarios
        </button>
        <button
          className={`tab-button ${activeTab === "perfiles" ? "active" : ""}`}
          onClick={() => setActiveTab("perfiles")}
        >
          Perfiles
        </button>
      </div>

      {activeTab === "usuarios" && (
        <div className="content-section">
          <h3>Usuarios registrados</h3>
          {errorUsuarios && <div className="message error">{errorUsuarios}</div>}
          {mensajeUsuarios && <div className="message success">{mensajeUsuarios}</div>}

          <input
            type="text"
            placeholder="Buscar usuario"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-bar"
          />

          <ul className="user-list">
            {filteredUsuarios.map((usuario) => (
              <li key={usuario.id_usuario} className="user-item">
                {usuario.username} - Perfil: {usuario.perfil}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "perfiles" && (
        <div className="content-section">
          <h3>Gestión de perfiles</h3>
          {errorPerfiles && <div className="message error">{errorPerfiles}</div>}
          {mensajePerfiles && <div className="message success">{mensajePerfiles}</div>}
          
          <select 
            value={selectedPerfilId} 
            onChange={handleSelectChange} 
            className="user-select"
          >
            <option value="">Seleccione un Usuario</option>
            {filteredUsuarios.map((usuario) => (
              <option 
                key={usuario.id_usuario} 
                value={usuario.id_usuario}
              >
                ID: {usuario.id_usuario} | Usuario: {usuario.username} | 
                Estado: {parseInt(usuario.estado) === 1 ? '✅ Activo' : '❌ Inactivo'}
              </option>
            ))}
          </select>

          <div>
            <button 
              className="action-button"
              onClick={() => handleUserAction('inhabilitar')}
            >
              Inhabilitar
            </button>
            <button 
              className="action-button"
              onClick={() => handleUserAction('habilitar')}
            >
              Habilitar
            </button>
            <button 
              className="action-button delete"
              onClick={() => handleUserAction('eliminar')}
            >
              Eliminar
            </button>
            <button 
              className="action-button edit"
              onClick={() => handleUserAction('editar')}
            >
              Editar
            </button>
          </div>
        </div>
      )}

      <button 
        className="back-button"
        onClick={() => navigate('/dashboard')}
      >
        Regresar a Dashboard
      </button>
    </div>
  );
}

export default RegistroPerfil;
