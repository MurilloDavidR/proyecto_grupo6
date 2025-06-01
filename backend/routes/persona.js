const express = require('express');
const router = express.Router();
const Persona = require('../models/persona');
const { enviarCorreoRegistro } = require('../utils/email'); // <-- importa la función

router.post('/registro', async (req, res) => {
  const { nombres, apellidos, correo, direccion, municipio, telefono } = req.body;

  if (!nombres || !apellidos || !correo) {
    return res.status(400).json({ error: 'Nombre, apellido y correo son obligatorios' });
  }

  try {
    const idPersona = await Persona.crearPersona(
      nombres,
      apellidos,
      correo,
      direccion,
      municipio,
      telefono
    );

    // Intentamos enviar el correo (sin bloquear la respuesta)
    enviarCorreoRegistro(correo, nombres)
      .then(() => console.log(`Correo de registro enviado a ${correo}`))
      .catch(err => console.error('Error enviando correo:', err));

    res.json({
      message: '✅ Persona registrada correctamente',
      id_persona: idPersona
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: '⚠️ Este correo ya está registrado.' });
    }

    console.error('❌ Error al registrar persona:', error.message, '\n', error.stack);
    res.status(500).json({ error: 'Error interno al registrar persona' });
  }
});


router.get('/', async (req, res) => {
  try {
    const personas = await Persona.obtenerPersonas();
    res.json(personas);
  } catch (error) {
    console.error('❌ Error al obtener personas:', error);
    res.status(500).json({ error: 'Error interno al obtener personas' });
  }
});

module.exports = router;
