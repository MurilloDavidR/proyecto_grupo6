const mysql = require('mysql2/promise');
const Persona = require('../models/persona');
const Usuario = require('../models/usuario');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Doscolores2024.',
  database: 'sistema_gestion',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function crearUsuarios() {
  try {
    // Obtener id_perfil para perfil "usuario"
    const [rows] = await pool.execute('SELECT id_perfil FROM perfil WHERE nombre = ?', ['usuario']);
    if (rows.length === 0) {
      console.error('No se encontró el perfil "usuario" en la base de datos.');
      return;
    }
    const id_perfil_usuario = rows[0].id_perfil;

    // Crear 4 personas para los usuarios
    const personas = [];
    for (let i = 1; i <= 4; i++) {
      const id_persona = await Persona.crearPersona(pool, 
        `Usuario ${i}`, // nombres
        '',             // apellidos vacíos
        `usuario${i}@example.com`, // correo genérico válido
        null,           // direccion null
        'Ciudad',       // municipio genérico válido
        null            // telefono null
      );
      personas.push(id_persona);
    }

    // Crear 4 usuarios con perfil "usuario" y contraseña "123456789"
    for (let i = 1; i <= 4; i++) {
      const username = `Usuario ${i}`;
      const password = '123456789';
      const id_persona = personas[i - 1];
      const estado = true;
      const id_usuario = await Usuario.crearUsuario(pool, username, password, id_persona, id_perfil_usuario, estado);
      console.log(`Usuario creado: ${username} con id_usuario: ${id_usuario}`);
    }

    console.log('Creación de usuarios completada.');
  } catch (error) {
    console.error('Error al crear usuarios:', error);
  } finally {
    await pool.end();
  }
}

crearUsuarios();
