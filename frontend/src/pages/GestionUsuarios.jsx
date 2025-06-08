import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/RegistroUsuario.css';

function RegistroUsuario() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    id_persona: '',
    id_perfil: '',
    estado: true
  });

  const [personas, setPersonas] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      const personasRes = await axios.get('http://localhost:3000/api/persona');
      const perfilesRes = await axios.get('http://localhost:3000/api/perfil/mi-perfil');
      const usuariosRes = await axios.get('http://localhost:3000/api/usuario');
      setPersonas(personasRes.data);
      setPerfiles(perfilesRes.data);
      setUsuarios(usuariosRes.data);
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      if (editando) {
        // Actualizar usuario
        await axios.put(`http://localhost:3000/api/usuario/${editando}`, form);
        setMensaje('Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        await axios.post('http://localhost:3000/api/usuario/registro', form);
        setMensaje('Usuario registrado correctamente');
      }
      setForm({
        username: '',
        password: '',
        id_persona: '',
        id_perfil: '',
        estado: true
      });
      setEditando(null);
      fetchDatos();
    } catch (err) {
      setError(err.response?.data?.error || '❌ Error al guardar usuario');
    }
  };

  const handleEdit = (usuario) => {
    setEditando(usuario.id_usuario);
    setForm({
      username: usuario.username,
      password: '',
      id_persona: usuario.id_persona,
      id_perfil: usuario.id_perfil,
      estado: Boolean(usuario.estado)
    });
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      await axios.delete(`http://localhost:3000/api/usuario/${id}`);
      fetchDatos();
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.username} ${u.nombres} ${u.apellidos} ${u.correo}`.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="registro-usuario-container">
      <h2>{editando ? 'Editar Usuario' : 'Registrar Usuario'}</h2>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Nombre de usuario:</label>
        <input name="username" value={form.username} onChange={handleChange} required />

        {!editando && (
          <>
            <label>Contraseña:</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </>
        )}

        <label>Persona:</label>
        <select name="id_persona" value={form.id_persona} onChange={handleChange} required>
          <option value="">Seleccionar persona</option>
          {personas.map(p => (
            <option key={p.id_persona} value={p.id_persona}>
              {p.nombres} {p.apellidos}
            </option>
          ))}
        </select>

        <label>Perfil:</label>
        <select name="id_perfil" value={form.id_perfil} onChange={handleChange} required>
          <option value="">Seleccionar perfil</option>
          {perfiles.map(p => (
            <option key={p.id_perfil} value={p.id_perfil}>
              {p.nombre}
            </option>
          ))}
        </select>

        <label>
          <input type="checkbox" name="estado" checked={form.estado} onChange={handleChange} />
          Activo
        </label>

        <button type="submit">{editando ? 'Actualizar' : 'Crear Usuario'}</button>
      </form>

      <hr />

      <h3>Usuarios registrados</h3>
      <input
        type="text"
        placeholder="Buscar..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Persona</th>
            <th>Correo</th>
            <th>Perfil</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id_usuario}>
              <td>{u.username}</td>
              <td>{u.nombres} {u.apellidos}</td>
              <td>{u.correo}</td>
              <td>{u.perfil}</td>
              <td>{u.estado ? "Activo" : "Inactivo"}</td>
              <td>
                <button onClick={() => handleEdit(u)}>✏️</button>
                <button onClick={() => handleDelete(u.id_usuario)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegistroUsuario;
