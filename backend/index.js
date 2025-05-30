const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db'); // El pool ya se prueba al importar

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 🚀');
});

// Rutas de la API
const perfilRoutes = require('./routes/perfil');
app.use('/api/perfiles', perfilRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error interno:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
