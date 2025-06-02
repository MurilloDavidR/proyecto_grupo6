// Importación de módulos necesarios
import { useState } from 'react'; // Hook para manejar el estado del componente
import axios from 'axios'; // Librería para realizar peticiones HTTP
import '../styles/RegistroClave.css'; // Importación de estilos específicos para el componente

// Definición del componente de recuperación de clave
function RecuperarClave() {
  // Estados para gestionar el correo, mensajes de éxito y errores
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    setMensaje(''); // Reinicia el mensaje de éxito
    setError(''); // Reinicia el mensaje de error

    try {
      // Enviar solicitud POST al backend para recuperar la clave
      const res = await axios.post('http://localhost:3000/api/usuario/recuperar-clave', { correo });
      setMensaje(res.data.message); // Establece el mensaje de respuesta en caso de éxito
    } catch (err) {
      // Captura y muestra errores en caso de fallo en la recuperación
      setError(err.response?.data?.error || '❌ Error al recuperar contraseña');
    }
  };

  return (
    <div className="recuperar-clave-container">
      <h2>¿Olvidaste tu contraseña?</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo de entrada para el correo electrónico */}
        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required // Asegura que el usuario ingrese un correo
        />
        <button type="submit">Enviar nueva contraseña</button>
      </form>

      {/* Muestra el mensaje de éxito en verde */}
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

      {/* Muestra el mensaje de error en rojo */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

// Exportación del componente para su uso en otras partes de la aplicación
export default RecuperarClave;