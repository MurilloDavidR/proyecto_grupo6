import { useState } from 'react';

function RegistroPerfil() {
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState('1'); // Estado predeterminado: Activo
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/perfiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, estado }) // Enviar estado
            });

            if (response.ok) {
                const data = await response.json();
                setMensaje(data.message); // Mostrar mensaje de éxito
                setNombre(''); // Limpiar el campo de entrada
                setEstado('1'); // Restablecer estado a "Activo"
            } else {
                setMensaje('Error al registrar el perfil');
            }
        } catch (error) {
            setMensaje('Hubo un problema con la solicitud');
        }
    };

    return (
        <div>
            <h2>Registro de Perfil</h2>
            {mensaje && <p>{mensaje}</p>} {/* Mostrar mensaje */}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del perfil"
                />

                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                </select>

                <button type="submit">Guardar</button>
            </form>
        </div>
    );
}

export default RegistroPerfil;