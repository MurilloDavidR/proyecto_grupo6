import { useState } from 'react';
import axios from 'axios';
import '../styles/RegistroPersona.css';

const RegistroPersona = () => {
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
    } catch (error) {
      console.error('Error al registrar persona', error);
      alert('Hubo un error al registrar la persona');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Registro de Persona</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control"
            type="text"
            name="nombres"
            placeholder="Nombres"
            value={form.nombres}
            onChange={handleChange}
          />
          <input
            className="form-control"
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={form.apellidos}
            onChange={handleChange}
          />
          <input
            className="form-control"
            type="email"
            name="correo"
            placeholder="Correo"
            value={form.correo}
            onChange={handleChange}
          />
          <input
            className="form-control"
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
          />
          <input
            className="form-control"
            type="text"
            name="municipio"
            placeholder="Municipio"
            value={form.municipio}
            onChange={handleChange}
          />
          <input
            className="form-control"
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
          />
          <input
            className="form-control"
            type="text"
            name="id_usuario"
            placeholder="ID de usuario (opcional)"
            value={form.id_usuario}
            onChange={handleChange}
          />
          <div>
            <label>
              <input
                type="checkbox"
                name="estado"
                checked={form.estado}
                onChange={handleChange}
              />
              {' '}Activo
            </label>
          </div>
          <button type="submit" className="btn">Registrar Persona</button>
        </form>
      </div>
    </div>
  );
};

export default RegistroPersona;
