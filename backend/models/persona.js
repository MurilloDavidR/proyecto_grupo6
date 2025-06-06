const Persona = {
  crearPersona: async (db, nombres, apellidos, correo, direccion, municipio, telefono) => {
    const [result] = await db.execute(
      `INSERT INTO persona (nombres, apellidos, correo, direccion, municipio, telefono)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombres ?? null,
        apellidos ?? null,
        correo ?? null,
        direccion ?? null,
        municipio ?? null,
        telefono ?? null
      ]
    );
    return result.insertId;
  },

  obtenerPersonas: async (db) => {
    const [rows] = await db.execute('SELECT * FROM persona');
    return rows;
  }
};

module.exports = Persona;
