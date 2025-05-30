const db = require('../config/db');

const Usuario = {
  crearUsuario: async (username, password, id_persona, id_perfil, estado) => {
    const [result] = await db.execute(
      `INSERT INTO usuario (username, password, id_persona, id_perfil, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [
        username ?? null,
        password ?? null,
        id_persona ?? null,
        id_perfil ?? null,
        estado ?? true
      ]
    );

    return result.insertId;
  },

  obtenerUsuarios: async () => {
    const [rows] = await db.execute('SELECT * FROM usuario');
    return rows;
  }
};

module.exports = Usuario;
