// src/pages/RegistroPerfil.jsx
import { useState } from "react";

const RegistroPerfil = () => {
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const perfil = { nombre, estado };

    try {
      const response = await fetch("http://localhost:3000/api/perfiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(perfil),
      });

      if (response.ok) {
        setMensaje("✅ Perfil registrado exitosamente");
        setNombre("");
        setEstado(true);
      } else {
        setMensaje("❌ Error al registrar el perfil");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setMensaje("❌ Error de conexión con el servidor");
    }
  };

  return (
    <div className="registro-perfil">
      <h2>Registro de Perfil</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre del Perfil:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Estado:</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value === "true")}>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>

        <button type="submit">Registrar Perfil</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default RegistroPerfil;