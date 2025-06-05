const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// 📌 Obtener perfiles activos
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('GET /api/perfil - Token:', req.headers.authorization);
    const search = req.query.search;
    let query = 'SELECT * FROM perfil';
    let params = [];
    if (search) {
      query += ' WHERE nombre LIKE ?';
      params.push(`%${search}%`);
    }
    const [results] = await db.query(query, params);
    console.log('Perfiles obtenidos:', results);
    res.json(results);
  } catch (err) {
    console.error('❌ Error al obtener perfiles:', err);
    res.status(500).json({ error: 'Error al obtener los perfiles' });
  }
});

// 📌 Registrar un nuevo perfil
router.post('/', authenticateToken, authorizeRoles('administrador'), async (req, res) => {
  const { nombre, estado } = req.body;

  if (!nombre || estado === undefined) {
    return res.status(400).json({ error: 'El campo nombre y estado son obligatorios' });
  }

  try {
    const [result] = await db.query('INSERT INTO perfil (nombre, estado) VALUES (?, ?)', [nombre, estado]);
    res.json({ message: '✅ Perfil registrado exitosamente', perfilId: result.insertId });
  } catch (err) {
    console.error('❌ Error al registrar el perfil:', err);
    res.status(500).json({ error: 'Error al registrar el perfil' });
  }
});

// 📌 Actualizar un perfil
router.put('/:id', authenticateToken, authorizeRoles('administrador'), async (req, res) => {
  const { id } = req.params;
  const { nombre, estado } = req.body;

  if (!nombre || estado === undefined) {
    return res.status(400).json({ error: 'El campo nombre y estado son obligatorios' });
  }

  try {
    const [result] = await db.query('UPDATE perfil SET nombre = ?, estado = ? WHERE id_perfil = ?', [nombre, estado, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    res.json({ message: '✅ Perfil actualizado exitosamente' });
  } catch (err) {
    console.error('❌ Error al actualizar el perfil:', err);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
});

// 📌 Eliminar un perfil
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM perfil WHERE id_perfil = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    res.json({ message: '✅ Perfil eliminado exitosamente' });
  } catch (err) {
    console.error('❌ Error al eliminar el perfil:', err);
    res.status(500).json({ error: 'Error al eliminar el perfil' });
  }
});

router.get('/usuarios', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT u.id_usuario, u.username, p.nombre as perfil, p.estado FROM usuario u JOIN perfil p ON u.id_perfil = p.id_perfil"
    );
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener usuarios con perfil:', error);
    res.status(500).json({ error: 'Error al obtener usuarios con perfil' });
  }
});

module.exports = router;
