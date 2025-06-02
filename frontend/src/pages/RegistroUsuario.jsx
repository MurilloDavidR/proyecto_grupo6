import { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Cargar personas y perfiles al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const personasRes = await axios.get('http://localhost:3000/api/persona');
        const perfilesRes = await axios.get('http://localhost:3000/api/perfil');
        setPersonas(personasRes.data);
        setPerfiles(perfilesRes.data);
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };
    fetchData();
  }, []);

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
      const res = await axios.post('http://localhost:3000/api/usuario/registro', form);
      setMensaje(res.data.message);
      setForm({
        username: '',
        password: '',
        id_persona: '',
        id_perfil: '',
        estado: true
      });
    } catch (err) {
      setError(err.response?.data?.error || '❌ Error al registrar usuario');
    }
  };

  return (
    <div className="registro-usuario-container">
      <h2>Registrar Usuario</h2>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Nombre de usuario:</label>
        <input name="username" value={form.username} onChange={handleChange} required />

        <label>Contraseña:</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />

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

        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  );
}

export default RegistroUsuario;
