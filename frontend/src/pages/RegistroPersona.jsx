import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/RegistroPersona.css';
import logo from '../logo.png';

const RegistroPersona = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    direccion: '',
    municipio: '',
    telefono: '',
    id_usuario: '',
    estado: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/persona', form);
      alert('Persona registrada correctamente');
      setForm({
        nombres: '',
        apellidos: '',
        correo: '',
        direccion: '',
        municipio: '',
        telefono: '',
        id_usuario: '',
        estado: true
      });
      navigate('/login'); // 🔁 Redirección automática
    } catch (error) {
      console.error('Error al registrar persona', error);
      alert('Hubo un error al registrar la persona');
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-content">
        <div className="registro-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="registro-card">
          <h2>Registro</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombres">Nombres</label>
              <input
                className="form-control"
                type="text"
                id="nombres"
                name="nombres"
                placeholder="Ingrese los nombres"
                value={form.nombres}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                className="form-control"
                type="text"
                id="apellidos"
                name="apellidos"
                placeholder="Ingrese los apellidos"
                value={form.apellidos}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="correo">Correo</label>
              <input
                className="form-control"
                type="email"
                id="correo"
                name="correo"
                placeholder="Ingrese el correo"
                value={form.correo}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="direccion">Dirección</label>
              <input
                className="form-control"
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Ingrese la dirección"
                value={form.direccion}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="municipio">Municipio</label>
              <input
                className="form-control"
                type="text"
                id="municipio"
                name="municipio"
                placeholder="Ingrese el municipio"
                value={form.municipio}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                className="form-control"
                type="text"
                id="telefono"
                name="telefono"
                placeholder="Ingrese el teléfono"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="id_usuario">ID de Usuario (opcional)</label>
              <input
                className="form-control"
                type="text"
                id="id_usuario"
                name="id_usuario"
                placeholder="Ingrese el ID del usuario"
                value={form.id_usuario}
                onChange={handleChange}
              />
            </div>
            <div className="form-group checkbox-wrapper">
              <label>
                <input
                  type="checkbox"
                  name="estado"
                  checked={form.estado}
                  onChange={handleChange}
                />{' '}
                Activo
              </label>
            </div>
            <button type="submit" className="btn">Registrar Persona</button>
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => navigate('/login')}
            >
              ← Volver al inicio de sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroPersona;



