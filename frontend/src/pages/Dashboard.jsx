// Importación de los hooks necesarios de React
import { useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; // Hook para la navegación en React Router

// Definición del componente Dashboard
function Dashboard() {
  const navigate = useNavigate(); // Inicialización de la función de navegación

  // useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
    // Obtiene el perfil guardado en localStorage
    const perfil = localStorage.getItem("perfil");

    // Si el usuario no es administrador, se deniega el acceso y se redirige al login
    if (perfil !== "Administrador") {
      alert("⛔ Acceso denegado"); // Muestra una alerta al usuario
      navigate("/login"); // Redirige al usuario a la pantalla de inicio de sesión
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <div>
      <h2>Bienvenido al panel de administración</h2>
      <p>Has iniciado sesión correctamente como administrador.</p>
    </div>
  );
}

// Exportación del componente para su uso en otras partes de la aplicación
export default Dashboard;