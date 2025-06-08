const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// 📌 Obtener información del perfil del usuario autenticado
router.get('/mi-perfil', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id_usuario;
    const [rows] = await db.execute(`
      SELECT 
        per.nombres, per.apellidos, per.correo, 
        per.direccion, per.municipio, per.telefono,
        p.nombre as perfil
      FROM sistema_gestion.usuario u
      JOIN sistema_gestion.perfil p ON u.id_perfil = p.id_perfil
      JOIN sistema_gestion.persona per ON u.id_persona = per.id_persona
      WHERE u.id_usuario = ?
    `, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

// 📌 Actualizar información personal del usuario
router.put('/actualizar-mi-perfil', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id_usuario;
    const { nombres, apellidos, correo, telefono, direccion, municipio } = req.body;

    // Buscar el id_persona del usuario
    const [userRows] = await db.execute(
      'SELECT id_persona FROM sistema_gestion.usuario WHERE id_usuario = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const personaId = userRows[0].id_persona;

    // Actualizar datos
    const [updateResult] = await db.execute(
      `UPDATE sistema_gestion.persona SET 
        nombres = COALESCE(?, nombres),
        apellidos = COALESCE(?, apellidos),
        correo = COALESCE(?, correo),
        telefono = ?,
        direccion = ?,
        municipio = ?
      WHERE id_persona = ?`,
      [nombres, apellidos, correo, telefono, direccion, municipio, personaId]
    );

    // Obtener los datos actualizados
    const [updatedData] = await db.execute(
      `SELECT 
        nombres, apellidos, correo, 
        telefono, direccion, municipio
      FROM sistema_gestion.persona 
      WHERE id_persona = ?`,
      [personaId]
    );

    res.json({
      message: 'Datos actualizados exitosamente',
      data: updatedData[0]
    });

  } catch (error) {
    console.error('Error al actualizar datos personales:', error);
    res.status(500).json({ 
      error: 'Error al actualizar los datos personales',
      details: error.message 
    });
  }
});

router.get('/', (req, res) => {
  res.json({ message: 'Ruta base de perfil. Use /mi-perfil o /actualizar-mi-perfil.' });
});

router.get('/lista', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM sistema_gestion.perfil');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener la lista de perfiles:', error);
    res.status(500).json({ error: 'Error al obtener la lista de perfiles' });
  }
});

module.exports = router;
