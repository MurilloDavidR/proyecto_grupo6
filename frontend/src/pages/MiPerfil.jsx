import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import '../styles/MiPerfil.css';

function MiPerfil() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    direccion: '',
    municipio: '',
    telefono: '',
    perfil: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('Enviando datos:', {
        nombres: perfil.nombres,
        apellidos: perfil.apellidos,
        correo: perfil.correo,
        telefono: perfil.telefono,
        direccion: perfil.direccion,
        municipio: perfil.municipio
      });
      
      const response = await api.put('/perfil/actualizar-mi-perfil', {
        nombres: perfil.nombres || '',
        apellidos: perfil.apellidos || '',
        correo: perfil.correo || '',
        telefono: perfil.telefono || '',
        direccion: perfil.direccion || '',
        municipio: perfil.municipio || ''
      });

      if (response.data.data) {
        setPerfil(prev => ({
          ...prev,
          ...response.data.data
        }));
      }

      setMessage('✅ Datos actualizados exitosamente');
      setEditMode(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error al actualizar:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.details || 'Error al actualizar los datos';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await api.get('/perfil/mi-perfil');
        console.log('Datos recibidos:', response.data);
        setPerfil(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar:', err);
        setError('Error al cargar el perfil: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };

    fetchPerfil();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderField = (label, name, value) => {
    return (
      <div className="perfil-item">
        <label>{label}</label>
        {editMode ? (
          <input
            type="text"
            name={name}
            value={value || ''}
            onChange={handleChange}
            className="perfil-input"
          />
        ) : (
          <p>{value || 'No especificado'}</p>
        )}
      </div>
    );
  };

  if (loading && !editMode) return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>Cargando perfil...</h1>
      </div>
    </div>
  );

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <div className="perfil-menu">
          <span className="perfil-menu-item">Archivo</span>
          <span className="perfil-menu-item">Editar</span>
          <span className="perfil-menu-item">Ver</span>
          <span className="perfil-menu-item">Ayuda</span>
        </div>
        <button 
          className="dashboard-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Volver al Dashboard
        </button>
      </div>

      <div className="perfil-content">
        <div className="perfil-sidebar">
          <div className="perfil-avatar">
            👤
          </div>
          <h3>{perfil.nombres} {perfil.apellidos}</h3>
          <p>{perfil.perfil}</p>
          {!editMode ? (
            <button 
              className="edit-button"
              onClick={() => setEditMode(true)}
            >
              ✏️ Editar Perfil
            </button>
          ) : (
            <div className="edit-buttons">
              <button 
                className="save-button"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? '⏳ Guardando...' : '💾 Guardar'}
              </button>
              <button 
                className="cancel-button"
                onClick={() => {
                  setEditMode(false);
                  // Recargar los datos originales
                  api.get('/perfil/mi-perfil').then(response => {
                    setPerfil(response.data);
                  });
                }}
                disabled={loading}
              >
                ❌ Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="perfil-main">
          {message && (
            <div className="success-message">
              {message}
            </div>
          )}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="perfil-section">
            <h2>Información Personal</h2>
            <div className="perfil-grid">
              {renderField('Nombres', 'nombres', perfil.nombres)}
              {renderField('Apellidos', 'apellidos', perfil.apellidos)}
              {renderField('Correo Electrónico', 'correo', perfil.correo)}
              {renderField('Teléfono', 'telefono', perfil.telefono)}
            </div>
          </div>

          <div className="perfil-section">
            <h2>Ubicación</h2>
            <div className="perfil-grid">
              {renderField('Dirección', 'direccion', perfil.direccion)}
              {renderField('Municipio', 'municipio', perfil.municipio)}
            </div>
          </div>

          <div className="perfil-section">
            <h2>Información de Cuenta</h2>
            <div className="perfil-grid">
              <div className="perfil-item">
                <label>Tipo de Perfil</label>
                <p>{perfil.perfil}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="perfil-statusbar">
        {currentTime.toLocaleString()} | Usuario: {perfil.nombres} | Perfil: {perfil.perfil}
      </div>
    </div>
  );
}

export default MiPerfil;
