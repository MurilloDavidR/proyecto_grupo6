
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db'); // Conexión a MySQL

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 📌 Ruta raíz para comprobar que el backend está activo
app.get('/', (req, res) => {
    res.send('✅ Servidor backend funcionando 🚀');
});

// 📌 Rutas de la API
const perfilRoutes = require('./routes/perfil');
const usuarioRoutes = require('./routes/usuario'); // 🔹 Cambiado de `usuarios` a `usuario`
const personaRoutes = require('./routes/persona'); // 🔹 Cambiado de `personas` a `persona`

app.use('/api/perfil', perfilRoutes); // 🔹 Ajuste en la ruta para mantener coherencia con la tabla
app.use('/api/usuario', usuarioRoutes);
app.use('/api/persona', personaRoutes);

// 📌 Manejo de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error interno:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// 📌 Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});