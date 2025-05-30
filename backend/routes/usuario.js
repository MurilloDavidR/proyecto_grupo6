const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

// 📌 Registrar usuario
router.post('/registro', async (req, res) => {
  const { username, password, id_persona, id_perfil, estado } = req.body;

  if (!username || !password || !id_persona || !id_perfil) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const id_usuario = await Usuario.crearUsuario(username, password, id_persona, id_perfil, estado);
    res.json({ message: '✅ Usuario registrado correctamente', id_usuario });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno al registrar usuario' });
  }
});

module.exports = router;
