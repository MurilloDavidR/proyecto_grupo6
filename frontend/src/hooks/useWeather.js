import { useState, useCallback, useEffect } from 'react';

const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (selectedDate = new Date()) => {
    try {
      setLoading(true);
      setError(null);
      
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
      const lat = import.meta.env.VITE_DEFAULT_LAT;
      const lon = import.meta.env.VITE_DEFAULT_LON;
      
      const isToday = selectedDate.toDateString() === new Date().toDateString();
      
      let url = isToday
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
        : `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al obtener el pronóstico del tiempo');
      }
      
      const data = await response.json();
      
      if (isToday) {
        setWeather(data);
      } else {
        // Para días futuros, buscar el pronóstico más cercano
        const selectedTimestamp = selectedDate.setHours(12, 0, 0, 0);
        const forecast = data.list.find(item => {
          const forecastDate = new Date(item.dt * 1000);
          return forecastDate.setHours(0,0,0,0) === selectedDate.setHours(0,0,0,0);
        });
        
        setWeather(forecast || null);
      }
    } catch (error) {
      console.error('Error en la obtención del clima:', error);
      setError(error.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar el clima cada 30 minutos
  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 1800000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return {
    weather,
    loading,
    error,
    fetchWeather
  };
};

export default useWeather;
