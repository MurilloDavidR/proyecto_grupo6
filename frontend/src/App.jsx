import { BrowserRouter as Router, Route, Routes }  from "react-router-dom";
import RegistroPerfil  from "./pages/registroperfil"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/registro-perfil" element={<RegistroPerfil />} />
      </Routes>
    </Router>
  );
}

export default App;
