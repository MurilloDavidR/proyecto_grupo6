import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegistroPerfil() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: "", perfil: "" });
  const [usuarios, setUsuarios] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [selectedPerfilId, setSelectedPerfilId] = useState('');
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [debugMsg, setDebugMsg] = useState("Renderizando RegistroPerfil...");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("usuarios"); // 'usuarios' o 'perfiles'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDebugMsg("Ejecutando useEffect en RegistroPerfil...");
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
    setDebugMsg("Token válido, obteniendo usuarios y perfiles...");

    // Obtener usuarios
    axios
      .get("http://127.0.0.1:3000/api/perfil/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsuarios(response.data);
        setDebugMsg("Usuarios obtenidos correctamente.");
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          setError("");
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
    setMensaje('');
    setError('');
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
      setError('Seleccione un perfil para inhabilitar');
      return;
    }
    const perfil = perfiles.find(p => p.id_perfil.toString() === selectedPerfilId);
    if (!perfil) {
      setError('Perfil no encontrado');
      return;
    }
    const token = localStorage.getItem('token');
    axios.put(`/api/perfil/${selectedPerfilId}`, { nombre: perfil.nombre, estado: 0 }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensaje('Perfil inhabilitado correctamente');
      setSelectedPerfilId('');
      refreshPerfiles();
    })
    .catch(() => setError('Error al inhabilitar perfil'));
  };

  const handleHabilitar = () => {
    if (!selectedPerfilId) {
      setError('Seleccione un perfil para habilitar');
      return;
    }
    const perfil = perfiles.find(p => p.id_perfil.toString() === selectedPerfilId);
    if (!perfil) {
      setError('Perfil no encontrado');
      return;
    }
    const token = localStorage.getItem('token');
    axios.put(`/api/perfil/${selectedPerfilId}`, { nombre: perfil.nombre, estado: 1 }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensaje('Perfil habilitado correctamente');
      setSelectedPerfilId('');
      refreshPerfiles();
    })
    .catch(() => setError('Error al habilitar perfil'));
  };

  const handleEliminar = () => {
    if (!selectedPerfilId) {
      setError('Seleccione un perfil para eliminar');
      return;
    }
    if (!window.confirm('¿Está seguro de eliminar este perfil?')) return;
    const token = localStorage.getItem('token');
    axios.delete(`/api/perfil/${selectedPerfilId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensaje('Perfil eliminado correctamente');
      setSelectedPerfilId('');
      refreshPerfiles();
    })
    .catch(() => setError('Error al eliminar perfil'));
  };

  const handleEditar = () => {
    if (!selectedPerfilId) {
      setError('Seleccione un perfil para editar');
      return;
    }
    const perfil = perfiles.find(p => p.id_perfil.toString() === selectedPerfilId);
    if (!perfil) {
      setError('Perfil no encontrado');
      return;
    }
    const nuevoNombre = prompt('Ingrese el nuevo nombre del perfil:', perfil.nombre);
    if (nuevoNombre === null || nuevoNombre.trim() === '') {
      setError('Nombre inválido');
      return;
    }
    const token = localStorage.getItem('token');
    axios.put(`/api/perfil/${selectedPerfilId}`, { nombre: nuevoNombre.trim(), estado: perfil.estado }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensaje('Perfil actualizado correctamente');
      refreshPerfiles();
    })
    .catch(() => setError('Error al actualizar perfil'));
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
          {error && <p style={{ color: "black", backgroundColor: "#8B0000" }}>{error}</p>}
          {mensaje && <p style={{ color: "black", backgroundColor: "#90EE90" }}>{mensaje}</p>}

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
          {error && <p style={{ color: "red" }}>{error}</p>}
          {mensaje && <p style={{ color: "lightgreen" }}>{mensaje}</p>}

          <input
            type="text"
            placeholder="Buscar perfil"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginRight: "10px", padding: "5px", width: "300px" }}
          />
          <select value={selectedPerfilId} onChange={handleSelectChange} style={{ minWidth: "200px", padding: "5px" }}>
            <option value="">Seleccione un perfil</option>
            {filteredPerfiles.map((usuario, index) => (
              <option key={usuario.id_usuario ? usuario.id_usuario.toString() : index} value={usuario.id_usuario || usuario.id}>
                ID: {usuario.id_usuario || usuario.id}, Usuario: {usuario.username || usuario.usuario}, Perfil: {usuario.perfil || usuario.nombre_perfil}
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
