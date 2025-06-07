import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio";
import RegistroPerfil from "./pages/RegistroPerfil";
import RegistroPersona from "./pages/RegistroPersona";
import Login from "./Login";
import RecuperarClave from "./pages/RecuperarClave";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/registro-persona" element={<RegistroPersona />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-clave" element={<RecuperarClave />} />
        {/* Rutas protegidas */}
        <Route path="/registro-perfil" element={<PrivateRoute><RegistroPerfil /></PrivateRoute>} />
       
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        {/* Puedes agregar más rutas según sea necesario */}
      </Routes>
    </Router>
  );
}

export default App;
