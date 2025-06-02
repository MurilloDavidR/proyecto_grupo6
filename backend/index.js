// Importación de módulos necesarios para configurar el servidor
const express = require('express'); // Framework para crear aplicaciones web y APIs en Node.js
const cors = require('cors'); // Middleware para permitir solicitudes desde diferentes dominios
const dotenv = require('dotenv'); // Carga variables de entorno desde un archivo .env
const db = require('./config/db'); // Configuración de la base de datos

// Cargar las variables de entorno definidas en el archivo .env
dotenv.config(); 

// Inicialización de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000; // Definir el puerto del servidor (por defecto, 3000)

// Middleware
app.use(cors()); // Habilita CORS para permitir solicitudes de diferentes dominios
app.use(express.json()); // Permite el uso de JSON en las solicitudes

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('✅ Servidor backend funcionando 🚀');
});

// Importación de las rutas de diferentes módulos
const perfilRoutes = require('./routes/perfil'); // Rutas para gestionar perfiles
const usuarioRoutes = require('./routes/usuario'); // Rutas para gestionar usuarios
const personaRoutes = require('./routes/persona'); // Rutas para gestionar personas

// Asignación de rutas a la aplicación
app.use('/api/perfil', perfilRoutes);
app.use('/api/usuario', usuarioRoutes); // ✅ SOLO una vez para evitar conflictos
app.use('/api/persona', personaRoutes);

// Middleware para manejo global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error interno:', err); // Registra el error en la consola
  res.status(500).json({ error: 'Error interno del servidor' }); // Envía una respuesta de error al cliente
});

// Iniciar el servidor y escuchar en el puerto definido
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});