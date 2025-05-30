const db = require('../config/db');

const Persona = {
    crearPersona: async (nombres, apellidos, correo, estado, direccion, municipio, telefono, id_usuario) => {
        const [result] = await db.execute(
            `INSERT INTO persona (nombres, apellidos, correo, estado, direccion, municipio, telefono, id_usuario)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombres ?? null,
                apellidos ?? null,
                correo ?? null,
                estado ?? null,
                direccion ?? null,
                municipio ?? null,
                telefono ?? null,
                id_usuario ?? null
            ]
        );

        // ⬇️ Aquí devolvemos el id_persona recién creado
        return result.insertId;
    },

    obtenerPersonas: async () => {
        const [rows] = await db.execute('SELECT * FROM persona');
        return rows;
    }
};

module.exports = Persona;

