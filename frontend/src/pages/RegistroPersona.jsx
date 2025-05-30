import React, { useState } from 'react';
import axios from 'axios';

function RegistroPersona() {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        correo: '',
        estado: true,
        direccion: '',
        municipio: '',
        telefono: '',
        id_usuario: null, // o podrías manejarlo desde contexto/sesión
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData({ ...formData, [name]: val });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/personas/registro', formData);
            alert(response.data.message);
        } catch (error) {
            console.error('❌ Error al registrar persona:', error);
            alert('Error al registrar persona');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="nombres" placeholder="Nombres" onChange={handleChange} />
            <input name="apellidos" placeholder="Apellidos" onChange={handleChange} />
            <input name="correo" placeholder="Correo" onChange={handleChange} />
            <input name="direccion" placeholder="Dirección" onChange={handleChange} />
            <input name="municipio" placeholder="Municipio" onChange={handleChange} />
            <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
            {/* Simulación de id_usuario si se requiere manual */}
            <input name="id_usuario" placeholder="ID de usuario (opcional)" onChange={handleChange} />

            <label>
                Activo:
                <input
                    type="checkbox"
                    name="estado"
                    checked={formData.estado}
                    onChange={handleChange}
                />
            </label>

            <button type="submit">Registrar Persona</button>
        </form>
    );
}

export default RegistroPersona;
