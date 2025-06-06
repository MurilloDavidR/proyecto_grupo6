import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Configurar la URL base de axios
axios.defaults.baseURL = 'http://localhost:3000';

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

    // Usar el token almacenado en localStorage
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
      .get("/api/perfil/usuarios", {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      })
      .then((response) => {
        console.log('Usuarios recibidos:', response.data);
        setUsuarios(response.data);
        setDebugMsg("Usuarios obtenidos correctamente.");
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          setErrorUsuarios("Acceso denegado para obtener usuarios.");
          setDebugMsg("Acceso denegado para obtener usuarios.");
        } else {
          setErrorUsuarios("Error al obtener usuarios: " + (error.message || ""));
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
        setErrorPerfiles('Respuesta inesperada del servidor');
      }
    })
    .catch(() => setErrorPerfiles('Error al obtener perfiles'))
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

  const refreshUsuarios = () => {
    const token = localStorage.getItem('token');
    axios.get("/api/perfil/usuarios", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setUsuarios(response.data);
      setDebugMsg("Lista de usuarios actualizada");
    })
    .catch(error => {
      setErrorPerfiles('Error al obtener usuarios: ' + (error.response?.data?.error || error.message));
      setDebugMsg("Error al actualizar lista de usuarios");
    });
  };

  const handleInhabilitar = () => {
    if (!selectedPerfilId) {
      setErrorPerfiles('Seleccione un usuario para inhabilitar');
      return;
    }
    const usuario = usuarios.find(u => u.id_usuario.toString() === selectedPerfilId);
    if (!usuario) {
      setErrorPerfiles('Usuario no encontrado');
      return;
    }
    const token = localStorage.getItem('token');
    console.log('Inhabilitando usuario:', selectedPerfilId);
    console.log('Usuario antes de inhabilitar:', usuario);
    axios.put(`/api/usuario/inhabilitar/${selectedPerfilId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((inhabilitar_response) => {
      console.log('Respuesta al inhabilitar:', inhabilitar_response.data);
      setMensajePerfiles('✅ Usuario inhabilitado correctamente. Estado: Inactivo');
      
      // Actualizar el usuario localmente
      const usuariosActualizados = usuarios.map(u => {
        if (u.id_usuario.toString() === selectedPerfilId) {
          return { ...u, estado: 0 };
        }
        return u;
      });
      setUsuarios(usuariosActualizados);
      setSelectedPerfilId('');
    })
    .catch((error) => {
      setErrorPerfiles('Error al inhabilitar usuario: ' + (error.response?.data?.error || error.message));
    });
  };

  const handleHabilitar = () => {
    if (!selectedPerfilId) {
      setErrorPerfiles('Seleccione un usuario para habilitar');
      return;
    }
    const usuario = usuarios.find(u => u.id_usuario.toString() === selectedPerfilId);
    if (!usuario) {
      setErrorPerfiles('Usuario no encontrado');
      return;
    }
    const token = localStorage.getItem('token');
    console.log('Habilitando usuario:', selectedPerfilId);
    axios.put(`/api/usuario/habilitar/${selectedPerfilId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensajePerfiles('✅ Usuario habilitado correctamente. Estado: Activo');
      
      // Actualizar el usuario localmente
      const usuariosActualizados = usuarios.map(u => {
        if (u.id_usuario.toString() === selectedPerfilId) {
          return { ...u, estado: 1 };
        }
        return u;
      });
      setUsuarios(usuariosActualizados);
      setSelectedPerfilId('');
    })
    .catch((error) => {
      setErrorPerfiles('Error al habilitar usuario: ' + (error.response?.data?.error || error.message));
    });
  };

  const handleEliminar = () => {
    if (!selectedPerfilId) {
      setErrorPerfiles('Seleccione un usuario para eliminar');
      return;
    }
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;
    const token = localStorage.getItem('token');
    axios.delete(`/api/usuario/${selectedPerfilId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensajePerfiles('Usuario eliminado correctamente');
      setSelectedPerfilId('');
      // Actualizar la lista de usuarios
      axios.get("/api/perfil/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsuarios(response.data);
      });
    })
    .catch(() => setErrorPerfiles('Error al eliminar usuario'));
  };

  const handleEditar = () => {
    if (!selectedPerfilId) {
      setErrorPerfiles('Seleccione un usuario para editar');
      return;
    }
    const usuario = usuarios.find(u => u.id_usuario.toString() === selectedPerfilId);
    console.log('Usuario encontrado:', usuario);
    if (!usuario) {
      setErrorPerfiles('Usuario no encontrado');
      return;
    }
    const nuevoNombre = prompt('Ingrese el nuevo nombre de usuario:', usuario.username);
    if (nuevoNombre === null || nuevoNombre.trim() === '') {
      setErrorPerfiles('Nombre inválido');
      return;
    }
    const token = localStorage.getItem('token');
    console.log('Token a utilizar:', token);
    try {
      // Decodificar y mostrar el payload del token
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
    } catch (error) {
      console.error('Error al decodificar token:', error);
    }
    axios.get('/api/perfil', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(perfilesResponse => {
      console.log('Perfiles disponibles:', perfilesResponse.data);
      
      // Encontrar el perfil correcto
      const perfilEncontrado = perfilesResponse.data.find(p => p.nombre.toLowerCase() === usuario.perfil.toLowerCase());
      if (!perfilEncontrado) {
        setErrorPerfiles('Error: No se pudo encontrar el perfil del usuario');
        return;
      }
      
      console.log('Perfil encontrado:', perfilEncontrado);
      const datosActualizacion = {
        username: nuevoNombre.trim(),
        id_perfil: perfilEncontrado.id_perfil
      };
      console.log('Datos a enviar en la actualización:', datosActualizacion);
      
      return axios.put(`/api/usuario/${selectedPerfilId}`, datosActualizacion, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      });
    })
    .then((editar_response) => {
      if (!editar_response) return; // Si no hay respuesta es porque hubo error al obtener el perfil
      console.log('Respuesta completa del servidor:', editar_response);
      console.log('Respuesta al editar:', editar_response.data);
      setMensajePerfiles('Usuario actualizado correctamente');
      
      // Actualizar el usuario localmente
      const usuariosActualizados = usuarios.map(u => {
        if (u.id_usuario.toString() === selectedPerfilId) {
          return { ...u, username: nuevoNombre.trim() };
        }
        return u;
      });
      setUsuarios(usuariosActualizados);
      setSelectedPerfilId('');
    })
    .catch(() => setErrorPerfiles('Error al actualizar usuario'));
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
                ID: {usuario.id_usuario || usuario.id} | Usuario: {usuario.username || usuario.usuario} | Estado: {parseInt(usuario.estado) === 1 ? '✅ Activo' : '❌ Inactivo'}
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

