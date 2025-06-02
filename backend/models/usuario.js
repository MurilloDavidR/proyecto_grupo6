// Importación de la configuración de la base de datos
const db = require('../config/db'); 

// Importación de bcrypt para el manejo de encriptación de contraseñas
const bcrypt = require('bcrypt'); 

// Definición del modelo Usuario con métodos para la gestión de usuarios
const Usuario = {

  // Método para crear un nuevo usuario en la base de datos
  crearUsuario: async (username, password, id_persona, id_perfil, estado) => {
    // Generación del hash de la contraseña para almacenar de forma segura
    const passwordHasheado = await bcrypt.hash(password, 10);

    // Inserción de los datos del usuario en la base de datos
    const [result] = await db.execute(
      `INSERT INTO usuario (username, password, id_persona, id_perfil, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [
        username ?? null,   // Si el valor es undefined, se asigna null para evitar errores en la BD
        passwordHasheado,   // Almacena la contraseña encriptada
        id_persona ?? null, 
        id_perfil ?? null, 
        estado ?? true      // Si estado no está definido, se establece como true por defecto
      ]
    );

    // Retorna el ID del usuario recién creado
    return result.insertId;
  },

  // Método para obtener la lista de todos los usuarios
  obtenerUsuarios: async () => {
    // Consulta de todos los registros en la tabla "usuario"
    const [rows] = await db.execute('SELECT * FROM usuario');

    // Retorna la lista de usuarios obtenidos
    return rows;
  }
};

// Exportación del módulo para su uso en otros archivos
module.exports = Usuario;