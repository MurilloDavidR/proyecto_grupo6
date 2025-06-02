const express = require('express');
const router = express.Router();
const Persona = require('../models/persona');
const { enviarCorreoRegistro } = require('../utils/email'); // ✅ Importa el módulo de envío de correos

// 📌 Registrar persona
router.post('/registro', async (req, res) => {
  const { nombres, apellidos, correo, direccion, municipio, telefono } = req.body;

  // Validación básica
  if (!nombres || !apellidos || !correo) {
    return res.status(400).json({ error: 'Nombre, apellido y correo son obligatorios' });
  }

  try {
    // Crear persona en la base de datos
    const idPersona = await Persona.crearPersona(
      nombres,
      apellidos,
      correo,
      direccion,
      municipio,
      telefono
    );

    // ✉️ Enviar correo de bienvenida (no bloquea la respuesta)
    enviarCorreoRegistro(correo, nombres)
      .then(() => console.log(`✅ Correo enviado a ${correo}`))
      .catch(err => console.error('❌ Error enviando correo:', err.message));

    // Respuesta exitosa
    res.json({
      message: '✅ Persona registrada correctamente',
      id_persona: idPersona
    });

  } catch (error) {
    // Duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: '⚠️ Este correo ya está registrado.' });
    }

    // Error general
    console.error('❌ Error al registrar persona:', error.message, '\n', error.stack);
    res.status(500).json({ error: 'Error interno al registrar persona' });
  }
});

// 📌 Obtener personas
router.get('/', async (req, res) => {
  try {
    const personas = await Persona.obtenerPersonas();
    res.json(personas);
  } catch (error) {
    console.error('❌ Error al obtener personas:', error.message);
    res.status(500).json({ error: 'Error interno al obtener personas' });
  }
});

module.exports = router;
