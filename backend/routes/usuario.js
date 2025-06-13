const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { enviarCorreoClave, enviarCredenciales } = require('../utils/email');

const SECRET_KEY = process.env.JWT_SECRET || 'Colombia2025';

// ===================== Registro desde persona ya existente =====================
router.post('/registro', async (req, res) => {
  const { username, password, id_persona, id_perfil, estado } = req.body;

  if (!username || !password || !id_persona || !id_perfil) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const id_usuario = await Usuario.crearUsuario(db, username, password, id_persona, id_perfil, estado);

    // Obtener correo y nombre de la persona
    const [persona] = await db.execute('SELECT nombres, correo FROM persona WHERE id_persona = ?', [id_persona]);
    if (persona.length > 0) {
      await enviarCredenciales(persona[0].correo, persona[0].nombres, username, password);
    }

    res.json({ message: '✅ Usuario registrado correctamente', id_usuario });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: '⚠️ El nombre de usuario ya está en uso' });
    }
    console.error('❌ Error al registrar usuario:', error.message);
    res.status(500).json({ error: 'Error interno al registrar usuario' });
  }
});

// ===================== Crear usuario con nueva persona y enviar correo =====================
router.post('/crear', authenticateToken, authorizeRoles('Administrador'), async (req, res) => {
  const {
    username, password, estado, id_perfil,
    nombres, apellidos, correo, direccion, municipio, telefono
  } = req.body;

  if (!username || !password || !id_perfil || !nombres || !apellidos || !correo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const [existingEmail] = await db.execute('SELECT id_persona FROM persona WHERE correo = ?', [correo]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'El correo ya está en uso' });
    }

    const [personaResult] = await db.execute(
      'INSERT INTO persona (nombres, apellidos, correo, direccion, municipio, telefono) VALUES (?, ?, ?, ?, ?, ?)',
      [nombres, apellidos, correo, direccion, municipio, telefono]
    );
    const id_persona = personaResult.insertId;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO usuario (username, password, estado, id_perfil, id_persona) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, estado ? 1 : 0, id_perfil, id_persona]
    );

    await enviarCredenciales(correo, nombres, username, password);

    res.json({ message: '✅ Usuario creado y notificado correctamente' });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// ===================== Recuperar contraseña =====================
router.post('/recuperar-clave', async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ error: 'El correo es obligatorio' });

  try {
    const [rows] = await db.execute(`
      SELECT u.id_usuario, p.nombres
      FROM usuario u JOIN persona p ON u.id_persona = p.id_persona
      WHERE p.correo = ?`, [correo]);

    if (rows.length === 0) return res.status(404).json({ error: 'No se encontró un usuario con ese correo' });

    const { id_usuario, nombres } = rows[0];
    const nuevaClave = Math.random().toString(36).slice(-8);
    const claveEncriptada = await bcrypt.hash(nuevaClave, 10);

    await db.execute('UPDATE usuario SET password = ? WHERE id_usuario = ?', [claveEncriptada, id_usuario]);
    await enviarCorreoClave(correo, nombres, nuevaClave);

    res.json({ message: '✅ Se envió una nueva clave a tu correo' });
  } catch (error) {
    console.error('❌ Error al recuperar clave:', error.message);
    res.status(500).json({ error: 'Error interno al recuperar contraseña' });
  }
});

// ===================== Login =====================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute(`
      SELECT u.id_usuario, u.password, u.id_perfil, p.nombre as perfil_nombre
      FROM usuario u JOIN perfil p ON u.id_perfil = p.id_perfil
      WHERE username = ?`, [username]);

    if (rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const usuario = rows[0];
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({
      id_usuario: usuario.id_usuario,
      id_perfil: usuario.id_perfil,
      perfil: usuario.perfil_nombre,
      username
    }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, perfil: usuario.perfil_nombre, username });
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// ===================== Obtener todos los usuarios =====================
router.get('/', authenticateToken, authorizeRoles('Administrador'), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT u.id_usuario, u.username, u.estado, u.id_perfil,
             p.id_persona, p.nombres, p.apellidos, p.correo, p.direccion, p.municipio, p.telefono,
             pf.nombre AS perfil
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

// ===================== Actualizar usuario =====================
router.put('/:id', authenticateToken, authorizeRoles('Administrador'), async (req, res) => {
  const { id } = req.params;
  const {
    username, estado, id_perfil,
    nombres, apellidos, correo, direccion, municipio, telefono
  } = req.body;

  if (!username || !id_perfil || !nombres || !apellidos || !correo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const [userRows] = await db.execute('SELECT id_persona FROM usuario WHERE id_usuario = ?', [id]);
    if (userRows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const id_persona = userRows[0].id_persona;

    await db.execute(
      'UPDATE persona SET nombres = ?, apellidos = ?, correo = ?, direccion = ?, municipio = ?, telefono = ? WHERE id_persona = ?',
      [nombres, apellidos, correo, direccion, municipio, telefono, id_persona]
    );

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

// ===================== Habilitar/Inhabilitar usuario =====================
router.put('/inhabilitar/:id', authenticateToken, authorizeRoles('Administrador'), async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('UPDATE usuario SET estado = 0 WHERE id_usuario = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario inhabilitado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al inhabilitar usuario' });
  }
});

router.put('/habilitar/:id', authenticateToken, authorizeRoles('Administrador'), async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('UPDATE usuario SET estado = 1 WHERE id_usuario = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario habilitado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al habilitar usuario' });
  }
});

// ===================== Eliminar usuario y persona =====================
router.delete('/:id', authenticateToken, authorizeRoles('Administrador'), async (req, res) => {
  const { id } = req.params;
  try {
    const [userRows] = await db.execute('SELECT id_persona FROM usuario WHERE id_usuario = ?', [id]);
    if (userRows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const id_persona = userRows[0].id_persona;
    await db.execute('DELETE FROM usuario WHERE id_usuario = ?', [id]);
    await db.execute('DELETE FROM persona WHERE id_persona = ?', [id_persona]);

    res.json({ message: 'Usuario y persona eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
