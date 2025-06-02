import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistroPerfil from "./pages/RegistroPerfil";
import RegistroPersona from "./pages/RegistroPersona"; // <-- importa el nuevo componente
import Login from "./Login";
import RecuperarClave from "./pages/RecuperarClave";
import RegistroUsuario  from "./pages/RegistroUsuario";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro-perfil" element={<RegistroPerfil />} />
        <Route path="/registro-persona" element={<RegistroPersona />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-clave" element={<RecuperarClave />} />
        <Route path="/registro-usuario" element={<RegistroUsuario />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* agregar más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;
