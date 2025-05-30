import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistroPerfil from "./pages/RegistroPerfil";
import RegistroPersona from "./pages/RegistroPersona"; // <-- importa el nuevo componente
import Login from "./Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro-perfil" element={<RegistroPerfil />} />
        <Route path="/registro-persona" element={<RegistroPersona />} /> {/* nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;
