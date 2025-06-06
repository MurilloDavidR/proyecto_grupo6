import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import "../styles/Calendar.css";
import "../styles/Dashboard.css";

/**
 * Dashboard Component
 * 
 * Características principales:
 * - Panel de control principal del sistema
 * - Calendario interactivo con:
 *   - Fases lunares calculadas según la fecha
 *   - Estaciones del año para el hemisferio sur
 *   - Interfaz moderna y responsive
 * 
 * @returns {JSX.Element} Dashboard component
 */
function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Administrador";
  const perfil = localStorage.getItem("perfil") || "Administrador";
  const [currentTime, setCurrentTime] = useState(new Date());
  const [date, setDate] = useState(new Date());

  const getMoonPhase = (date) => {
    const LUNAR_MONTH = 29.530588853;
    const KNOWN_NEW_MOON = new Date(2000, 0, 6).getTime();
    const timestamp = date.getTime();
    const days = (timestamp - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
    const phase = ((days % LUNAR_MONTH) / LUNAR_MONTH) * 100;

    if (phase < 5) return "🌑 Luna Nueva";
    if (phase < 45) return "🌒 Luna Creciente";
    if (phase < 55) return "🌕 Luna Llena";
    if (phase < 95) return "🌘 Luna Menguante";
    return "🌑 Luna Nueva";
  };

  const getSeason = (date) => {
    const month = date.getMonth();
    const day = date.getDate();
    
    // Hemisferio Sur
    if ((month === 11 && day >= 21) || month === 0 || month === 1 || (month === 2 && day < 21)) {
      return "☀️ Verano";
    } else if ((month === 2 && day >= 21) || month === 3 || month === 4 || (month === 5 && day < 21)) {
      return "🍂 Otoño";
    } else if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day < 21)) {
      return "❄️ Invierno";
    } else {
      return "🌸 Primavera";
    }
  };

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

      <div className="dashboard-calendar">
        <div className="calendar-container">
          <Calendar
            onChange={setDate}
            value={date}
            locale="es-ES"
          />
        </div>
        <div className="calendar-info">
          <div className="info-card">
            <h3>Fase Lunar</h3>
            <p>{getMoonPhase(date)}</p>
          </div>
          <div className="info-card">
            <h3>Estación</h3>
            <p>{getSeason(date)}</p>
          </div>
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
