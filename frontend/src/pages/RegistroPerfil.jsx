import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import "../styles/RegistroPerfil.css";

function RegistroPerfil() {
  const navigate = useNavigate();
  const [usuarioActual, setUsuarioActual] = useState({ username: "", perfil: "" });
  const [usuarios, setUsuarios] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("usuarios");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    password: "",
    nombres: "",
    apellidos: "",
    correo: "",
    direccion: "",
    municipio: "",
    telefono: "",
    id_perfil: "",
    estado: 1,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No has iniciado sesión.");
      navigate("/login");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.perfil.toLowerCase() !== "administrador") {
      alert("Acceso denegado.");
      navigate("/login");
      return;
    }

    setUsuarioActual({ username: payload.username, perfil: payload.perfil });
    cargarDatos();
  }, [navigate]);

  const cargarDatos = async () => {
    try {
      const [resUsuarios, resPerfiles] = await Promise.all([
        api.get("/usuario"),
        api.get("/perfil"),
      ]);
      setUsuarios(resUsuarios.data);
      setPerfiles(resPerfiles.data);
    } catch (err) {
      setError("❌ Error al cargar datos.");
    }
  };

  const handleInputChange = (id, campo, valor) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id_usuario === id ? { ...u, [campo]: valor } : u))
    );
  };

  const guardarCambios = async (id) => {
    const usuario = usuarios.find((u) => u.id_usuario === id);
    try {
      const perfilObj = perfiles.find((p) => p.nombre === usuario.perfil);
      await api.put(`/usuario/${id}`, {
        username: usuario.username,
        id_perfil: perfilObj?.id_perfil,
        estado: usuario.estado === "Activo" || usuario.estado === 1 ? 1 : 0,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        direccion: usuario.direccion,
        municipio: usuario.municipio,
        telefono: usuario.telefono,
      });
      setMensaje("✅ Usuario actualizado");
      cargarDatos();
    } catch {
      setError("❌ Error al actualizar usuario.");
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Eliminar usuario permanentemente?")) return;
    try {
      await api.delete(`/usuario/${id}`);
      setMensaje("✅ Usuario eliminado");
      cargarDatos();
    } catch {
      setError("❌ Error al eliminar usuario.");
    }
  };

  const registrarUsuario = async () => {
    try {
      await api.post("/usuario/crear", {
        ...nuevoUsuario,
        estado: parseInt(nuevoUsuario.estado),
      });
      setMensaje("✅ Usuario registrado");
      setNuevoUsuario({
        username: "",
        password: "",
        nombres: "",
        apellidos: "",
        correo: "",
        direccion: "",
        municipio: "",
        telefono: "",
        id_perfil: "",
        estado: 1,
      });
      cargarDatos();
    } catch {
      setError("❌ Error al registrar usuario.");
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.username} ${u.nombres} ${u.correo}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="registro-perfil-container">
      <h2>¡Bienvenido, {usuarioActual.username}!</h2>
      <p>Perfil: {usuarioActual.perfil}</p>

      <div className="tabs-container">
        <button onClick={() => setActiveTab("usuarios")} className={activeTab === "usuarios" ? "active" : ""}>Usuarios</button>
        <button onClick={() => setActiveTab("perfiles")} className={activeTab === "perfiles" ? "active" : ""}>Perfiles</button>
      </div>

      {mensaje && <div className="success">{mensaje}</div>}
      {error && <div className="error">{error}</div>}

      {activeTab === "usuarios" && (
        <>
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <table className="crud-table">
            <thead>
              <tr>
                <th>Username</th><th>Nombre</th><th>Apellidos</th><th>Correo</th>
                <th>Dirección</th><th>Municipio</th><th>Teléfono</th>
                <th>Perfil</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id_usuario}>
                  <td><input value={u.username} onChange={e => handleInputChange(u.id_usuario, "username", e.target.value)} /></td>
                  <td><input value={u.nombres || ""} onChange={e => handleInputChange(u.id_usuario, "nombres", e.target.value)} /></td>
                  <td><input value={u.apellidos || ""} onChange={e => handleInputChange(u.id_usuario, "apellidos", e.target.value)} /></td>
                  <td><input value={u.correo || ""} onChange={e => handleInputChange(u.id_usuario, "correo", e.target.value)} /></td>
                  <td><input value={u.direccion || ""} onChange={e => handleInputChange(u.id_usuario, "direccion", e.target.value)} /></td>
                  <td><input value={u.municipio || ""} onChange={e => handleInputChange(u.id_usuario, "municipio", e.target.value)} /></td>
                  <td><input value={u.telefono || ""} onChange={e => handleInputChange(u.id_usuario, "telefono", e.target.value)} /></td>
                  <td>
                    <select value={u.perfil} onChange={e => handleInputChange(u.id_usuario, "perfil", e.target.value)}>
                      {perfiles.map(p => <option key={p.id_perfil} value={p.nombre}>{p.nombre}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={u.estado === 1 ? "Activo" : "Inactivo"} onChange={e => handleInputChange(u.id_usuario, "estado", e.target.value)}>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => guardarCambios(u.id_usuario)}>💾</button>
                    <button onClick={() => eliminarUsuario(u.id_usuario)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>➕ Registrar Nuevo Usuario</h3>
          <div className="nuevo-usuario-form">
            <input placeholder="Username" value={nuevoUsuario.username} onChange={e => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })} />
            <input type="password" placeholder="Contraseña" value={nuevoUsuario.password} onChange={e => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })} />
            <input placeholder="Nombres" value={nuevoUsuario.nombres} onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombres: e.target.value })} />
            <input placeholder="Apellidos" value={nuevoUsuario.apellidos} onChange={e => setNuevoUsuario({ ...nuevoUsuario, apellidos: e.target.value })} />
            <input placeholder="Correo" value={nuevoUsuario.correo} onChange={e => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })} />
            <input placeholder="Dirección" value={nuevoUsuario.direccion} onChange={e => setNuevoUsuario({ ...nuevoUsuario, direccion: e.target.value })} />
            <input placeholder="Municipio" value={nuevoUsuario.municipio} onChange={e => setNuevoUsuario({ ...nuevoUsuario, municipio: e.target.value })} />
            <input placeholder="Teléfono" value={nuevoUsuario.telefono} onChange={e => setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })} />
            <select value={nuevoUsuario.id_perfil} onChange={e => setNuevoUsuario({ ...nuevoUsuario, id_perfil: e.target.value })}>
              <option value="">Seleccionar perfil</option>
              {perfiles.map(p => <option key={p.id_perfil} value={p.id_perfil}>{p.nombre}</option>)}
            </select>
            <button onClick={registrarUsuario}>Registrar</button>
          </div>
        </>
      )}

      {activeTab === "perfiles" && (
        <>
          <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
            <option value="">Selecciona un usuario</option>
            {usuarios.map(u => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.username} ({u.estado === 1 ? "Activo" : "Inactivo"})
              </option>
            ))}
          </select>
          <div className="perfil-actions">
            <button onClick={() => accionesUsuario("inhabilitar")}>Inhabilitar</button>
            <button onClick={() => accionesUsuario("habilitar")}>Habilitar</button>
            <button onClick={() => accionesUsuario("eliminar")}>Eliminar</button>
          </div>
        </>
      )}

      <button onClick={() => navigate("/dashboard")} className="back-button">← Volver al Dashboard</button>
    </div>
  );
}

export default RegistroPerfil;
