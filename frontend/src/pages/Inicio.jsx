import { useNavigate } from 'react-router-dom';
import '../styles/Inicio.css'; 

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="inicio-container">
      <header className="navbar">
        <img src="/logo.png" alt="Logo" className="logo-image"/>
        <h1 className="logo">Sembrar</h1>
        <nav>
          <button className="btn-primary" onClick={() => navigate('/Login')}>
            Iniciar Sesión
          </button>
          <button className="btn-primary" onClick={() => navigate('/registro-persona')}>
            Registrarse
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h1>Cosecha tu futuro:<br />Invierte en agricultura</h1>
          <p>Clima y calendario al alcance de nuestra tierra.</p>
        </div>
        <img src="logo.png" alt="Campesino" className="hero-image" />
      </section>

      <section className="proposito">
        <div className="proposito-content">
          <h2>¿Por qué Sembrar?</h2>
            <p>
                Sembrar nace con el propósito de acercar la tecnología a los agricultores colombianos. 
                Brindamos herramientas como predicción del clima y calendarios de cultivo para ayudar 
                a tomar decisiones más informadas y mejorar la productividad del campo.
            </p>
            <p>
                Nuestra misión es empoderar al agricultor con información clara, accesible y oportuna, 
                promoviendo un desarrollo agrícola sostenible y conectado con la innovación.
            </p>
        </div>
      </section>

      <section className="estadisticas">
        <h2>Impacto de Sembrar</h2>
          <div className="estadisticas-grid">
            <div className="stat-box">
              <h3>+1.500</h3>
              <p>Agricultores activos</p>
            </div>
            <div className="stat-box">
              <h3>+2.800</h3>
              <p>Cultivos registrados</p>
            </div>
            <div className="stat-box">
              <h3>+900</h3>
              <p>Predicciones climáticas acertadas</p>
            </div>
            <div className="stat-box">
              <h3>+120</h3>
              <p>Municipios impactados</p>
            </div>
          </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <h3>🌱 Sembrar</h3>
          <p>Conectamos el campo colombiano con la tecnología para un futuro agrícola más sostenible.</p>
        <div className="footer-links">
          <a href="#">Términos y Condiciones</a>
          <a href="#">Política de Privacidad</a>
          <a href="#">Contacto</a>
        </div>
          <p className="footer-copy">&copy; {new Date().getFullYear()} Sembrar. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}