const express = require('express');
const router = express.Router();
const Persona = require('../models/persona');

// 📌 Registrar persona
router.post('/registro', async (req, res) => {
    const { nombres, apellidos, correo, estado, direccion, municipio, telefono, id_usuario } = req.body;

    // Validación básica
    if (!nombres || !apellidos || !correo) {
        return res.status(400).json({ error: 'Nombre, apellido y correo son obligatorios' });
    }

    try {
        // Guardar persona y obtener el ID generado
        const idPersona = await Persona.crearPersona(
            nombres,
            apellidos,
            correo,
            estado,
            direccion,
            municipio,
            telefono,
            id_usuario
        );

        res.json({
            message: '✅ Persona registrada correctamente',
            id_persona: idPersona
        });
    } catch (error) {
        console.error('❌ Error al registrar persona:', error);
        res.status(500).json({ error: 'Error interno al registrar persona' });
    }
});

// 📌 Obtener todas las personas
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
