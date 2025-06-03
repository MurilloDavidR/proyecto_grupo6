import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RegistroPerfil() {
  const [perfiles, setPerfiles] = useState([]);
  const [selectedPerfilId, setSelectedPerfilId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Poner aquí el token generado para pruebas
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGVyZmlsIjoiYWRtaW5pc3RyYWRvciIsImlhdCI6MTc0ODkxMjAxNCwiZXhwIjo0OTA0NjcyMDE0fQ.bSeD_ztWo4hrOzD7r_zh25nBTxh36vhLQrp8s8WwXqg';
    if (!token) {
      setError('Token no proporcionado');
      setLoading(false);
      return;
    }
    console.log('Iniciando petición a /api/perfil/usuarios con token:', token);
    axios.get('/api/perfil/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log('Respuesta recibida de /api/perfil/usuarios:', response.data);
      if (Array.isArray(response.data)) {
        setPerfiles(response.data);
      } else {
        setPerfiles([]);
        setError('Respuesta inesperada del servidor');
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error al obtener usuarios:', error);
      setError('Error al obtener usuarios');
      setLoading(false);
    });
  }, []);

  // Ajuste para asegurar que los campos usados existen en los objetos recibidos
  const filteredPerfiles = perfiles.filter(usuario =>
    usuario.username && usuario.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchPerfiles = (query = '') => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token no proporcionado');
      setLoading(false);
      return;
    }
    setLoading(true);
    axios.get('/api/perfil/usuarios', {
      headers: { Authorization: `Bearer ${token}` },
      params: query ? { search: query } : {}
    })
    .then(response => {
      if (Array.isArray(response.data)) {
        setPerfiles(response.data);
      } else {
        setPerfiles([]);
        setError('Respuesta inesperada del servidor');
      }
      setLoading(false);
    })
    .catch(() => {
      setError('Error al obtener usuarios');
      setLoading(false);
    });
  };

  const handleSearchClick = () => {
    fetchPerfiles(searchTerm);
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
    <div style={{ backgroundColor: '#013220', color: 'white', padding: '20px', minHeight: '100vh' }}>
      <h1>Gestión de perfiles</h1>
      {loading ? (
        <p>Cargando perfiles...</p>
      ) : (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {mensaje && <p style={{ color: 'lightgreen' }}>{mensaje}</p>}

          <input
            type="text"
            placeholder="Buscar perfil"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginRight: '10px', padding: '5px', width: '300px' }}
          />
          <select value={selectedPerfilId} onChange={handleSelectChange} style={{ minWidth: '200px', padding: '5px' }}>
            <option value="">Seleccione un perfil</option>
            {filteredPerfiles.map((usuario, index) => (
              <option key={usuario.id_usuario ? usuario.id_usuario.toString() : index} value={usuario.id_usuario || usuario.id}>
                ID: {usuario.id_usuario || usuario.id}, Usuario: {usuario.username || usuario.usuario}, Perfil: {usuario.perfil || usuario.nombre_perfil}
              </option>
            ))}
          </select>
          <button onClick={handleInhabilitar} style={{ marginLeft: '10px', padding: '5px' }}>Inhabilitar</button>
          <button onClick={handleHabilitar} style={{ marginLeft: '10px', padding: '5px' }}>Habilitar</button>
          <button onClick={handleEliminar} style={{ marginLeft: '10px', padding: '5px' }}>Eliminar</button>
          <button onClick={handleEditar} style={{ marginLeft: '10px', padding: '5px' }}>Editar</button>
        </>
      )}
      <button onClick={() => window.location.href = '/dashboard'} style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}>
        Regresar a Dashboard
      </button>
    </div>
  );
}

export default RegistroPerfil;
