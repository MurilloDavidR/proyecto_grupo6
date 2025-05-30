import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistroPerfil from "./pages/RegistroPerfil";
import Login from "./Login"; // Asegúrate de que el nombre del archivo esté bien

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Ruta principal para Login */}
        <Route path="/registro-perfil" element={<RegistroPerfil />} />
      </Routes>
    </Router>
  );
}

export default App;