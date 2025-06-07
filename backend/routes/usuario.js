// Importación de módulos necesarios
const express = require('express'); // Framework para crear servidores en Node.js
const router = express.Router(); // Manejador de rutas en Express
const Usuario = require('../models/usuario'); // Modelo de usuario para interactuar con la base de datos
const { authenticateToken, authorizeRoles } = require('../middleware/auth'); // Middleware de autenticación
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
    const id_usuario = await Usuario.crearUsuario(db, username, password, id_persona, id_perfil, estado);
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
        perfil: usuario.perfil_nombre,
        username: username
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

// Ruta para inhabilitar un usuario (estado = 0)
router.put('/inhabilitar/:id', authenticateToken, authorizeRoles('administrador'), async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('UPDATE usuario SET estado = 0 WHERE id_usuario = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario inhabilitado correctamente' });
  } catch (error) {
    console.error('❌ Error al inhabilitar usuario:', error);
    res.status(500).json({ error: 'Error al inhabilitar usuario' });
  }
});

// Ruta para habilitar un usuario (estado = 1)
router.put('/habilitar/:id', authenticateToken, authorizeRoles('administrador'), async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('UPDATE usuario SET estado = 1 WHERE id_usuario = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario habilitado correctamente' });
  } catch (error) {
    console.error('❌ Error al habilitar usuario:', error);
    res.status(500).json({ error: 'Error al habilitar usuario' });
  }
});

// Ruta para eliminar un usuario
router.delete('/:id', authenticateToken, authorizeRoles('administrador'), async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM usuario WHERE id_usuario = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Ruta para editar un usuario (actualizar username y perfil)
router.put('/:id', authenticateToken, authorizeRoles('administrador'), async (req, res) => {
  const { id } = req.params;
  const { username, id_perfil } = req.body;

  if (!username || !id_perfil) {
    return res.status(400).json({ error: 'Los campos username e id_perfil son obligatorios' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE usuario SET username = ?, id_perfil = ? WHERE id_usuario = ?',
      [username, id_perfil, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// routes/usuario.js

router.get('/', authenticateToken, authorizeRoles('Administrador'), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        u.id_usuario, u.username, u.estado, u.id_perfil,
        p.id_persona, p.nombres, p.apellidos, p.correo, p.direccion, p.municipio, p.telefono,
        pf.nombre AS perfil_nombre
      FROM usuario u
      JOIN persona p ON u.id_persona = p.id_persona
      JOIN perfil pf ON u.id_perfil = pf.id_perfil
    `);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// routes/usuario.js - ruta para crear usuario con persona

router.post('/crear', authenticateToken, authorizeRoles('Administrador'), async (req, res) => {
  const {
    username,
    password,
    estado,
    id_perfil,
    nombres,
    apellidos,
    correo,
    direccion,
    municipio,
    telefono
  } = req.body;

  if (!username || !password || !id_perfil || !nombres || !apellidos || !correo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Verificar si el correo ya existe
    const [existingEmail] = await db.execute('SELECT id_persona FROM persona WHERE correo = ?', [correo]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'El correo ya está en uso' });
    }

    // Insertar en persona
    const [personaResult] = await db.execute(
      'INSERT INTO persona (nombres, apellidos, correo, direccion, municipio, telefono) VALUES (?, ?, ?, ?, ?, ?)',
      [nombres, apellidos, correo, direccion, municipio, telefono]
    );
    const id_persona = personaResult.insertId;

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar en usuario
    await db.execute(
      'INSERT INTO usuario (username, password, estado, id_perfil, id_persona) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, estado ? 1 : 0, id_perfil, id_persona]
    );

    res.json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// routes/usuario.js//actualizar usuario y persona. 

router.put('/:id', authenticateToken, authorizeRoles('administrador'), async (req, res) => {
  const { id } = req.params;
  const {
    username,
    estado,
    id_perfil,
    nombres,
    apellidos,
    correo,
    direccion,
    municipio,
    telefono
  } = req.body;

  if (!username || !id_perfil || !nombres || !apellidos || !correo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Obtener id_persona asociado al usuario
    const [userRows] = await db.execute('SELECT id_persona FROM usuario WHERE id_usuario = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const id_persona = userRows[0].id_persona;

    // Actualizar persona
    await db.execute(
      'UPDATE persona SET nombres = ?, apellidos = ?, correo = ?, direccion = ?, municipio = ?, telefono = ? WHERE id_persona = ?',
      [nombres, apellidos, correo, direccion, municipio, telefono, id_persona]
    );

    // Actualizar usuario
    await db.execute(
      'UPDATE usuario SET username = ?, estado = ?, id_perfil = ? WHERE id_usuario = ?',
      [username, estado ? 1 : 0, id_perfil, id]
    );

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});


// routes/usuario.js/ eliminar

router.delete('/:id', authenticateToken, authorizeRoles('administrador'), async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener id_persona asociado al usuario
    const [userRows] = await db.execute('SELECT id_persona FROM usuario WHERE id_usuario = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const id_persona = userRows[0].id_persona;

    // Eliminar usuario
    await db.execute('DELETE FROM usuario WHERE id_usuario = ?', [id]);

    // Eliminar persona
    await db.execute('DELETE FROM persona WHERE id_persona = ?', [id_persona]);

    res.json({ message: 'Usuario y persona eliminados correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
