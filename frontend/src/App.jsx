import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio";
import RegistroPerfil from "./pages/RegistroPerfil";
import RegistroPersona from "./pages/RegistroPersona";
import Login from "./Login";
import RecuperarClave from "./pages/RecuperarClave";
import Dashboard from "./pages/Dashboard";
import MiPerfil from "./pages/MiPerfil";
import PrivateRoute from "./components/PrivateRoute";

import LogoutButton from './components/LogoutButton';

function App() {
  return (
    <Router>
      <LogoutButton />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro-persona" element={<RegistroPersona />} />
        <Route path="/recuperar-clave" element={<RecuperarClave />} />
        {/* Rutas protegidas */}
        <Route path="/registro-perfil" element={<PrivateRoute><RegistroPerfil /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/mi-perfil" element={<PrivateRoute><MiPerfil /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
