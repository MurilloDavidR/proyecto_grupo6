import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Administrador";
  const perfil = localStorage.getItem("perfil") || "Administrador";
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">¡Bienvenido, {username}!</h1>
        <p className="dashboard-profile">
          Perfil: {perfil} | {currentTime.toLocaleTimeString()}
        </p>
      </div>

      <div className="dashboard-content">
        {perfil.toLowerCase() === 'administrador' && (
          <div className="dashboard-card">
            <h3>Gestión de Perfiles</h3>
            <p>Administra los perfiles y usuarios del sistema</p>
            <button 
              className="dashboard-button"
              onClick={() => navigate('/registro-perfil')}
            >
              Gestionar Perfiles
            </button>
          </div>
        )}

        <div className="dashboard-card">
          <h3>Panel de Control</h3>
          <p>Visualiza y controla las operaciones del sistema</p>
          <button 
            className="dashboard-button"
            onClick={() => navigate('/dashboard')}
          >
            Ver Panel
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">2</div>
          <div className="stat-label">Módulos Activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{currentTime.toLocaleDateString()}</div>
          <div className="stat-label">Fecha Actual</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          className="dashboard-button logout"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
