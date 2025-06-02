// Importación de módulos necesarios
const express = require('express'); // Framework para crear servidores en Node.js
const router = express.Router(); // Manejador de rutas en Express
const Usuario = require('../models/usuario'); // Modelo de usuario para interactuar con la base de datos
const bcrypt = require('bcrypt'); // Biblioteca para encriptar contraseñas
const jwt = require('jsonwebtoken'); // ✅ IMPORTANTE - Manejo de autenticación con tokens JWT
const { enviarCorreoClave } = require('../utils/email'); // Función para enviar correos de recuperación
const db = require('../config/db'); // Configuración de conexión a la base de datos
const SECRET_KEY = process.env.JWT_SECRET || 'Colombia2025'; // Clave secreta para generar JWT

// Ruta para registrar un nuevo usuario
router.post('/registro', async (req, res) => {
  const { username, password, id_persona, id_perfil, estado } = req.body;

  // Validación de datos requeridos
  if (!username || !password || !id_persona || !id_perfil) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Creación del usuario en la base de datos
    const id_usuario = await Usuario.crearUsuario(username, password, id_persona, id_perfil, estado);
    res.json({ message: '✅ Usuario registrado correctamente', id_usuario });
  } catch (error) {
    // Manejo de errores en caso de usuario duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: '⚠️ El nombre de usuario ya está en uso' });
    }

    console.error('❌ Error al registrar usuario:', error.message);
    res.status(500).json({ error: 'Error interno al registrar usuario' });
  }
});

// Ruta para recuperar contraseña
router.post('/recuperar-clave', async (req, res) => {
  const { correo } = req.body;

  // Validación de campo obligatorio
  if (!correo) {
    return res.status(400).json({ error: 'El correo es obligatorio' });
  }

  try {
    // Consulta a la base de datos para encontrar al usuario
    const [rows] = await db.execute(`
      SELECT u.id_usuario, p.nombres
      FROM usuario u
      JOIN persona p ON u.id_persona = p.id_persona
      WHERE p.correo = ?`, [correo]);

    // Validación de existencia del usuario
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró un usuario con ese correo' });
    }

    // Generación de nueva contraseña aleatoria
    const { id_usuario, nombres } = rows[0];
    const nuevaClave = Math.random().toString(36).slice(-8);
    const claveEncriptada = await bcrypt.hash(nuevaClave, 10);

    // Actualización de la nueva contraseña en la base de datos
    await db.execute('UPDATE usuario SET password = ? WHERE id_usuario = ?', [claveEncriptada, id_usuario]);

    // Envío de la nueva clave por correo
    await enviarCorreoClave(correo, nombres, nuevaClave);

    res.json({ message: '✅ Se envió una nueva clave a tu correo' });
  } catch (error) {
    console.error('❌ Error al recuperar clave:', error.message);
    res.status(500).json({ error: 'Error interno al recuperar contraseña' });
  }
});

// Ruta para iniciar sesión (Login)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log("🛂 Intentando login con:", username);

  try {
    // Consulta en la base de datos para obtener el usuario y su perfil
    const [rows] = await db.execute(`
      SELECT u.id_usuario, u.password, u.id_perfil, p.nombre as perfil_nombre
      FROM usuario u
      JOIN perfil p ON u.id_perfil = p.id_perfil
      WHERE username = ?`, [username]);

    // Validación de existencia del usuario
    if (rows.length === 0) {
      console.log("❌ Usuario no encontrado:", username);
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = rows[0];
    
    // Comparación de la contraseña ingresada con la almacenada en la base de datos
    const match = await bcrypt.compare(password, usuario.password);

    if (!match) {
      console.log("❌ Contraseña incorrecta para:", username);
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Creación del token JWT para autenticar sesiones
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        id_perfil: usuario.id_perfil,
        perfil: usuario.perfil_nombre
      },
      SECRET_KEY,
      { expiresIn: '1h' } // Expira en 1 hora
    );

    console.log("✅ Login exitoso:", username);
    res.json({ token, perfil: usuario.perfil_nombre, username });
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Exportación del módulo de rutas
module.exports = router;