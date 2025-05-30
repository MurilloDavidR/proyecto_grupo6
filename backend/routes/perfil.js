const express = require('express');
const pool = require('../config/db'); // Importamos la conexión

const router = express.Router();

// Obtener todos los perfiles activos
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM perfil WHERE estado = TRUE');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener perfiles:', error.message);
        res.status(500).json({ message: 'Error al obtener perfiles' });
    }
});

module.exports = router;