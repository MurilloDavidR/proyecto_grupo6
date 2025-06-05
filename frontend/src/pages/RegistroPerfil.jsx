import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [activeTab, setActiveTab] = useState("usuarios"); // 'usuarios' o 'perfiles'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDebugMsg("Ejecutando useEffect en RegistroPerfil...");
    let token = localStorage.getItem("token");
    console.log('Frontend - Token obtenido:', token);

    // Forzar uso de token válido generado manualmente para pruebas
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGVyZmlsIjoiYWRtaW5pc3RyYWRvciIsImlhdCI6MTc0OTA4NzIzOCwiZXhwIjo0OTA0ODQ3MjM4fQ.kq1D9auZFTa6KJipLGOUna9hUV55FQS8MWDDHoeM6rA";

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

    // Obtener usuarios
    axios
      .get("http://localhost:3000/api/perfil/usuarios", {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      })
      .then((response) => {
        setUsuarios(response.data);
        setDebugMsg("Usuarios obtenidos correctamente.");
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          setError("Acceso denegado para obtener usuarios.");
          setDebugMsg("Acceso denegado para obtener usuarios.");
        } else {
          setError("Error al obtener usuarios: " + (error.message || ""));
          setDebugMsg("Error al obtener usuarios: " + (error.message || ""));
        }
      });

    // Obtener perfiles
    axios.get('/api/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      if (Array.isArray(response.data)) {
        setPerfiles(response.data);
      } else {
        setPerfiles([]);
        setError('Respuesta inesperada del servidor');
      }
    })
    .catch(() => setError('Error al obtener perfiles'))
    .finally(() => setLoading(false));
  }, [navigate]);

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.username && usuario.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPerfiles = perfiles.filter((perfil) =>
    perfil.nombre && perfil.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChange = (e) => {
    setSelectedPerfilId(e.target.value);
    setMensajePerfiles('');
    setErrorPerfiles('');
    setMensajeUsuarios('');
    setErrorUsuarios('');
  };

  const refreshPerfiles = () => {
    const token = localStorage.getItem('token');
    axios.get('/api/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      if (Array.isArray(response.data)) {
        setPerfiles(response.data);
      } else {
        setPerfiles([]);
        setError('Respuesta inesperada del servidor');
      }
    })
    .catch(() => setError('Error al obtener perfiles'));
  };

  const handleInhabilitar = () => {
    if (!selectedPerfilId) {
      setErrorPerfiles('Seleccione un perfil para inhabilitar');
      return;
    }
    const perfil = perfiles.find(p => p.id_perfil.toString() === selectedPerfilId);
    if (!perfil) {
      setErrorPerfiles('Perfil no encontrado');
      return;
    }
    const token = localStorage.getItem('token');
    axios.put(`/api/perfil/${selectedPerfilId}`, { nombre: perfil.nombre, estado: 0 }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensajePerfiles('Perfil inhabilitado correctamente');
      setSelectedPerfilId('');
      refreshPerfiles();
    })
    .catch((error) => {
      setErrorPerfiles('Error al inhabilitar perfil: ' + (error.response?.data?.error || error.message));
    });
  };

  const handleHabilitar = () => {
    if (!selectedPerfilId) {
      setErrorPerfiles('Seleccione un perfil para habilitar');
      return;
    }
    const perfil = perfiles.find(p => p.id_perfil.toString() === selectedPerfilId);
    if (!perfil) {
      setErrorPerfiles('Perfil no encontrado');
      return;
    }
    const token = localStorage.getItem('token');
    axios.put(`/api/perfil/${selectedPerfilId}`, { nombre: perfil.nombre, estado: 1 }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensajePerfiles('Perfil habilitado correctamente');
      setSelectedPerfilId('');
      refreshPerfiles();
    })
    .catch((error) => {
      setErrorPerfiles('Error al habilitar perfil: ' + (error.response?.data?.error || error.message));
    });
  };

  const handleEliminar = () => {
    if (!selectedPerfilId) {
      setErrorPerfiles('Seleccione un perfil para eliminar');
      return;
    }
    if (!window.confirm('¿Está seguro de eliminar este perfil?')) return;
    const token = localStorage.getItem('token');
    axios.delete(`/api/perfil/${selectedPerfilId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensajePerfiles('Perfil eliminado correctamente');
      setSelectedPerfilId('');
      refreshPerfiles();
    })
    .catch(() => setErrorPerfiles('Error al eliminar perfil'));
  };

  const handleEditar = () => {
    if (!selectedPerfilId) {
      setErrorPerfiles('Seleccione un perfil para editar');
      return;
    }
    const perfil = perfiles.find(p => p.id_perfil.toString() === selectedPerfilId);
    if (!perfil) {
      setErrorPerfiles('Perfil no encontrado');
      return;
    }
    const nuevoNombre = prompt('Ingrese el nuevo nombre del perfil:', perfil.nombre);
    if (nuevoNombre === null || nuevoNombre.trim() === '') {
      setErrorPerfiles('Nombre inválido');
      return;
    }
    const token = localStorage.getItem('token');
    axios.put(`/api/perfil/${selectedPerfilId}`, { nombre: nuevoNombre.trim(), estado: perfil.estado }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensajePerfiles('Perfil actualizado correctamente');
      refreshPerfiles();
    })
    .catch(() => setErrorPerfiles('Error al actualizar perfil'));
  };

  return (
    <div style={{ backgroundColor: "#013220", color: "black", minHeight: "100vh", padding: "20px" }}>
      <h2>Bienvenido, {userData.username}</h2>
      <p>Perfil: {userData.perfil}</p>
      <p style={{ color: "black", backgroundColor: "#006400", padding: "5px" }}>{debugMsg}</p>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("usuarios")}
          style={{
            padding: "10px",
            marginRight: "10px",
            backgroundColor: activeTab === "usuarios" ? "#006400" : "#ccc",
            color: activeTab === "usuarios" ? "white" : "black",
            border: "none",
            cursor: "pointer",
          }}
        >
          Usuarios
        </button>
        <button
          onClick={() => setActiveTab("perfiles")}
          style={{
            padding: "10px",
            backgroundColor: activeTab === "perfiles" ? "#006400" : "#ccc",
            color: activeTab === "perfiles" ? "white" : "black",
            border: "none",
            cursor: "pointer",
          }}
        >
          Perfiles
        </button>
      </div>

      {activeTab === "usuarios" && (
        <>
          <h3>Usuarios registrados</h3>
          {errorUsuarios && <p style={{ color: "black", backgroundColor: "#8B0000" }}>{errorUsuarios}</p>}
          {mensajeUsuarios && <p style={{ color: "black", backgroundColor: "#90EE90" }}>{mensajeUsuarios}</p>}

          <input
            type="text"
            placeholder="Buscar usuario"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: "10px", padding: "5px", width: "80%" }}
          />
          <button
            onClick={() => setSearchTerm(searchTerm)}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            Buscar
          </button>
          <ul>
            {filteredUsuarios.map((usuario) => (
              <li key={usuario.id_usuario}>
                {usuario.username} - Perfil: {usuario.perfil}
              </li>
            ))}
          </ul>
        </>
      )}

      {activeTab === "perfiles" && (
        <>
          <h3>Gestión de perfiles</h3>
          
          <select value={selectedPerfilId} onChange={handleSelectChange} style={{ minWidth: "200px", padding: "5px" }}>
            <option value="">Seleccione un Usuario</option>
            {filteredUsuarios.map((usuario, index) => (
              <option key={usuario.id_usuario ? usuario.id_usuario.toString() : index} value={usuario.id_usuario || usuario.id}>
                ID {usuario.id_usuario || usuario.id}, Usuario: {usuario.username || usuario.usuario}, Estado: {usuario.estado !== undefined ? (usuario.estado ? 'Activo' : 'Inactivo') : usuario.nombre_estado}
              </option>  
            ))}
          </select>
          <button onClick={handleInhabilitar} style={{ marginLeft: "10px", padding: "5px" }}>Inhabilitar</button>
          <button onClick={handleHabilitar} style={{ marginLeft: "10px", padding: "5px" }}>Habilitar</button>
          <button onClick={handleEliminar} style={{ marginLeft: "10px", padding: "5px" }}>Eliminar</button>
          <button onClick={handleEditar} style={{ marginLeft: "10px", padding: "5px" }}>Editar</button>
        </>
      )}

      <button onClick={() => window.location.href = '/dashboard'} style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}>
        Regresar a Dashboard
      </button>
    </div>
  );
}

export default RegistroPerfil;
