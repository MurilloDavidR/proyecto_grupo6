import React from "react";

function Dashboard() {
  const username = localStorage.getItem("username") || "Administrador";
  const perfil = localStorage.getItem("perfil") || "Administrador";

  return (
    <div style={{ backgroundColor: "#013220", color: "black", minHeight: "100vh", padding: "20px" }}>
      <h2>Bienvenido, {username}</h2>
      <p>Perfil: {perfil}</p>

      <button onClick={() => window.location.href = '/registro-perfil'} style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}>
        Gestionar Perfiles
      </button>
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }} style={{ marginTop: '20px', marginLeft: '10px', padding: '10px', fontSize: '16px' }}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Dashboard;
