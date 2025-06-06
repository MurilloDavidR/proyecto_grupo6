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
    const [rows] = await db.execute('SELECT * FROM usuario');
    return rows;
  }
};

module.exports = Usuario;
