import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/RegistroPersona.css';
import logo from '../logo.png';

const RegistroPersona = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    direccion: '',
    municipio: '',
    telefono: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.correo)) {
      setErrorMsg("📧 El correo no tiene un formato válido.");
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/persona/registro', form);
      alert('✅ Persona registrada correctamente');
      setForm({
        nombres: '',
        apellidos: '',
        correo: '',
        direccion: '',
        municipio: '',
        telefono: ''
      });
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar persona', error);
      if (error.response && error.response.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("❌ Error interno al registrar persona.");
      }
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
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

          <form onSubmit={handleSubmit}>
            {['nombres', 'apellidos', 'correo', 'direccion', 'municipio', 'telefono'].map((field) => (
              <div className="form-group" key={field}>
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  className="form-control"
                  type={field === 'correo' ? 'email' : 'text'}
                  id={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required={['nombres', 'apellidos', 'correo'].includes(field)}
                />
              </div>
            ))}

            <button type="submit" className="btn">Registrar Persona</button>
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => navigate('/')}
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
