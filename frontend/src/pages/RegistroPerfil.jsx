// Importación del hook useState para manejar el estado del componente
import { useState } from 'react';

// Definición del componente RegistroPerfil
function RegistroPerfil() {
    // Estados para gestionar el nombre, estado del perfil y mensajes de respuesta
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState('1'); // Estado predeterminado: Activo
    const [mensaje, setMensaje] = useState('');

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que el formulario recargue la página

        try {
            // Realiza la solicitud al backend para registrar el perfil
            const response = await fetch('http://localhost:3000/api/perfiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, estado }) // Enviar datos en formato JSON
            });

            if (response.ok) {
                const data = await response.json();
                setMensaje(data.message); // Establece mensaje de éxito
                setNombre(''); // Limpia el campo de nombre
                setEstado('1'); // Restablece el estado a "Activo"
            } else {
                setMensaje('Error al registrar el perfil'); // Manejo de error en respuesta negativa
            }
        } catch (error) {
            setMensaje('Hubo un problema con la solicitud'); // Manejo de error en la solicitud
        }
    };

    return (
        <div>
            <h2>Registro de Perfil</h2>
            {mensaje && <p>{mensaje}</p>} {/* Muestra el mensaje de respuesta */}

            {/* Formulario para ingresar datos del perfil */}
            <form onSubmit={handleSubmit}>
                {/* Campo para el nombre del perfil */}
                <input 
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del perfil"
                />

                {/* Selector para el estado del perfil */}
                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                </select>

                {/* Botón para enviar el formulario */}
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
}

// Exportación del componente para su uso en otras partes de la aplicación
export default RegistroPerfil;