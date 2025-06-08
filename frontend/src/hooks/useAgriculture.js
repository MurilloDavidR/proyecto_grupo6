import { useMemo } from 'react';

const useAgriculture = (date) => {
  const getMoonPhase = useMemo(() => {
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
  }, [date]);

  const getTemporada = useMemo(() => {
    const month = date.getMonth();
    
    if (month >= 11 || month <= 1) return "☀️ Temporada Seca Principal";
    if (month >= 2 && month <= 4) return "🌧️ Primera Temporada de Lluvias";
    if (month >= 5 && month <= 7) return "🌤️ Temporada Seca Menor";
    return "🌧️ Segunda Temporada de Lluvias";
  }, [date]);

  const getCultivosRecomendados = useMemo(() => {
    const month = date.getMonth();
    const moonPhase = getMoonPhase;
    
    const cultivosPorTemporada = {
      seca_principal: [
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
      ],
      lluvia_primera: [
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
      ],
      seca_menor: [
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
      ],
      lluvia_segunda: [
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
      ]
    };

    if (month >= 11 || month <= 1) return cultivosPorTemporada.seca_principal;
    if (month >= 2 && month <= 4) return cultivosPorTemporada.lluvia_primera;
    if (month >= 5 && month <= 7) return cultivosPorTemporada.seca_menor;
    return cultivosPorTemporada.lluvia_segunda;
  }, [date, getMoonPhase]);

  return {
    moonPhase: getMoonPhase,
    temporada: getTemporada,
    cultivosRecomendados: getCultivosRecomendados
  };
};

export default useAgriculture;
