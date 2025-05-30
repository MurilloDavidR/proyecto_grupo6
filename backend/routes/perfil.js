const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 📌 Obtener perfiles activos
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM perfil WHERE estado = 1');
    res.json(results);
  } catch (err) {
    console.error('❌ Error al obtener perfiles:', err);
    res.status(500).json({ error: 'Error al obtener los perfiles' });
  }
});

// 📌 Registrar un nuevo perfil
router.post('/', async (req, res) => {
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

module.exports = router;
