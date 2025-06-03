require('dotenv').config();
const db = require('../config/db');

async function listarUsuarios() {
  try {
    const [rows] = await db.execute(
      "SELECT u.id_usuario, u.username, p.nombre as perfil FROM usuario u JOIN perfil p ON u.id_perfil = p.id_perfil"
    );
    console.log('Usuarios registrados:');
    rows.forEach(function(user) {
      console.log("ID: " + user.id_usuario + ", Usuario: " + user.username + ", Perfil: " + user.perfil);
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
  } finally {
    process.exit();
  }
}

listarUsuarios();
