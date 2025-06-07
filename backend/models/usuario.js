// Importación de la configuración de la base de datos
const bcrypt = require('bcrypt'); 

const Usuario = {

  crearUsuario: async (db, username, password, id_persona, id_perfil, estado) => {
    const passwordHasheado = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO usuario (username, password, id_persona, id_perfil, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [
        username ?? null,
        passwordHasheado,
        id_persona ?? null,
        id_perfil ?? null,
        estado ?? true
      ]
    );

    return result.insertId;
  },

  obtenerUsuarios: async (db) => {
  const [rows] = await db.execute(`
    SELECT 
      u.id_usuario, u.username, u.estado, 
      p.nombres, p.apellidos, p.correo, p.telefono, p.direccion, p.municipio,
      pr.nombre AS perfil
    FROM usuario u
    JOIN persona p ON u.id_persona = p.id_persona
    JOIN perfil pr ON u.id_perfil = pr.id_perfil
  `);
  return rows;
},
}

module.exports = Usuario;
