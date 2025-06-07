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
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchWeather(newDate);
  };

  const fetchWeather = async (selectedDate = new Date()) => {
    try {
      setLoading(true);
      // Coordenadas de Colombia (ejemplo: Bogotá)
      const lat = 4.6097;
      const lon = -74.0817;
      const API_KEY = '8e585ec0ab53b3cd79edf610f78e1496';
      
      // Si es el día actual, usar tiempo actual
      const isToday = selectedDate.toDateString() === new Date().toDateString();
      
      if (isToday) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
        );
        
        if (!response.ok) throw new Error('Error al obtener el clima');
        
        const data = await response.json();
        setWeather(data);
      } else {
        // Para días futuros, usar el pronóstico de 5 días
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
        );
        
        if (!response.ok) throw new Error('Error al obtener el pronóstico');
        
        const data = await response.json();
        
        // Encontrar el pronóstico más cercano a la fecha seleccionada
        const selectedTimestamp = selectedDate.setHours(12, 0, 0, 0);
        const forecast = data.list.find(item => {
          const forecastDate = new Date(item.dt * 1000);
          return forecastDate.setHours(0,0,0,0) === selectedDate.setHours(0,0,0,0);
        });
        
        if (forecast) {
          setWeather(forecast);
        } else {
          setWeather(null);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setWeather(null);
      setLoading(false);
    }
  };

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

  const getTemporada = (date) => {
    const month = date.getMonth();
    
    // Temporadas en Colombia
    if (month >= 11 || month <= 1) { // Diciembre - Febrero
      return "☀️ Temporada Seca Principal";
    } else if (month >= 2 && month <= 4) { // Marzo - Mayo
      return "🌧️ Primera Temporada de Lluvias";
    } else if (month >= 5 && month <= 7) { // Junio - Agosto
      return "🌤️ Temporada Seca Menor";
    } else {
      return "🌧️ Segunda Temporada de Lluvias"; // Septiembre - Noviembre
    }
  };

  const getCultivosRecomendados = (date) => {
    const month = date.getMonth();
    const moonPhase = getMoonPhase(date);
    
    // Recomendaciones según temporada y fase lunar
    if (month >= 11 || month <= 1) { // Temporada Seca Principal
      return [
        {
          nombre: "🌽 Maíz andino",
          info: "Ideal para siembra en temporada seca. Riego moderado cada 3-4 días.",
          lunaIdeal: moonPhase === "🌒 Luna Creciente" ? "✨ Luna ideal para siembra" : ""
        },
        {
          nombre: "🥔 Papa criolla",
          info: "Resistente a sequía. Necesita suelos bien drenados.",
          lunaIdeal: moonPhase === "🌑 Luna Nueva" ? "✨ Luna ideal para siembra" : ""
        },
        {
          nombre: "🫘 Frijol cargamanto",
          info: "Sembrar en suelos fértiles y profundos. Riego cada 4-5 días.",
          lunaIdeal: moonPhase === "🌒 Luna Creciente" ? "✨ Luna ideal para siembra" : ""
        }
      ];
    } else if (month >= 2 && month <= 4) { // Primera Temporada de Lluvias
      return [
        {
          nombre: "🍅 Tomate chonto",
          info: "Aprovechar lluvias naturales. Proteger de exceso de agua.",
          lunaIdeal: moonPhase === "🌒 Luna Creciente" ? "✨ Luna ideal para siembra" : ""
        },
        {
          nombre: "🥑 Aguacate hass",
          info: "Beneficiado por lluvias moderadas. Buen drenaje esencial.",
          lunaIdeal: moonPhase === "🌕 Luna Llena" ? "✨ Luna ideal para siembra" : ""
        },
        {
          nombre: "☘️ Yuca",
          info: "Tolera bien las lluvias. Evitar encharcamientos.",
          lunaIdeal: moonPhase === "🌒 Luna Creciente" ? "✨ Luna ideal para siembra" : ""
        }
      ];
    } else if (month >= 5 && month <= 7) { // Temporada Seca Menor
      return [
        {
          nombre: "🥬 Lechuga batavia",
          info: "Riego frecuente pero ligero. Ideal en zonas sombreadas.",
          lunaIdeal: moonPhase === "🌒 Luna Creciente" ? "✨ Luna ideal para siembra" : ""
        },
        {
          nombre: "🥕 Zanahoria",
          info: "Suelos sueltos y profundos. Riego regular.",
          lunaIdeal: moonPhase === "🌑 Luna Nueva" ? "✨ Luna ideal para siembra" : ""
        },
        {
          nombre: "🧅 Cebolla junca",
          info: "Resistente a sequías moderadas. Riego cada 2-3 días.",
          lunaIdeal: moonPhase === "🌒 Luna Creciente" ? "✨ Luna ideal para siembra" : ""
        }
      ];
    } else { // Segunda Temporada de Lluvias
      return [
        {
          nombre: "🎃 Ahuyama",
          info: "Aprovecha bien las lluvias. Necesita espacio amplio.",
          lunaIdeal: moonPhase === "🌒 Luna Creciente" ? "✨ Luna ideal para siembra" : ""
        },
        {
          nombre: "🫛 Quinua",
          info: "Resistente a lluvias fuertes. Suelos bien drenados.",
          lunaIdeal: moonPhase === "🌑 Luna Nueva" ? "✨ Luna ideal para siembra" : ""
        },
        {
          nombre: "🥬 Uchuva",
          info: "Beneficiada por lluvias moderadas. Proteger de excesos.",
          lunaIdeal: moonPhase === "🌒 Luna Creciente" ? "✨ Luna ideal para siembra" : ""
        }
      ];
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    fetchWeather(); // Obtener el clima al cargar
    const weatherTimer = setInterval(fetchWeather, 1800000); // Actualizar cada 30 minutos

    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header text-center">
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
      </div>

      <div className="dashboard-calendar">
        <div className="calendar-header">
          <h2>Datos Meteorológicos y Agrícolas</h2>
          <p className="calendar-description">
            Información detallada sobre fase lunar, temporada climática y pronóstico del tiempo para la región de Bogotá, Colombia
          </p>
        </div>
        <div className="calendar-content">
          <div className="calendar-info">
            <div className="info-card">
              <h3>Fase Lunar</h3>
              <p>{getMoonPhase(date)}</p>
            </div>
            <div className="info-card">
              <h3>Temporada</h3>
              <p>{getTemporada(date)}</p>
            </div>
            <div className="info-card weather-info-card">
              <h3>Pronóstico</h3>
              {loading ? (
                <p>Cargando...</p>
              ) : weather ? (
                <>
                  <div className="weather-main">
                    <img 
                      src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt="Clima actual"
                    />
                    <span className="temperature">{Math.round(weather.main.temp)}°C</span>
                  </div>
                  <p className="weather-description">{weather.weather[0].description}</p>
                  <div className="weather-details">
                    <small>💧 {weather.main.humidity}%</small>
                    <small>💨 {weather.wind.speed}m/s</small>
                  </div>
                </>
              ) : (
                <p>Este pronóstico solo es capaz de mostrar pronósticos del día y 5 días posteriores</p>
              )}
            </div>
          </div>
          <div className="calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={date}
              locale="es-ES"
            />
          </div>
        </div>
      </div>

      <div className="farming-recommendations">
        <h2>Cultivos Recomendados para la Temporada</h2>
        <div className="recommendations-grid">
          {getCultivosRecomendados(date).map((cultivo, index) => (
            <div key={index} className="recommendation-card">
              <h3>{cultivo.nombre}</h3>
              <p>{cultivo.info}</p>
              {cultivo.lunaIdeal && (
                <p className="luna-ideal">{cultivo.lunaIdeal}</p>
              )}
            </div>
          ))}
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
