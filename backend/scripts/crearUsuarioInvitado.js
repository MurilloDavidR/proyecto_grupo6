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

async function crearUsuarioInvitado() {
  try {
    // Obtener id_perfil para perfil "invitado"
    const [rows] = await pool.execute('SELECT id_perfil FROM perfil WHERE nombre = ?', ['invitado']);
    if (rows.length === 0) {
      console.error('No se encontró el perfil "invitado" en la base de datos.');
      return;
    }
    const id_perfil_invitado = rows[0].id_perfil;

    // Crear persona para el usuario invitado
    const id_persona = await Persona.crearPersona(pool, 
      'Guest',           // nombres
      '1',              // apellidos
      'guest1@test.com', // correo
      'N/A',            // dirección
      'N/A',            // municipio
      'N/A'             // teléfono
    );

    // Crear usuario invitado con la contraseña "123456"
    const username = 'guest1';
    const password = '123456';
    const estado = true;
    
    const id_usuario = await Usuario.crearUsuario(pool, username, password, id_persona, id_perfil_invitado, estado);
    console.log(`✅ Usuario invitado creado exitosamente:`);
    console.log(`   Username: ${username}`);
    console.log(`   ID Usuario: ${id_usuario}`);

  } catch (error) {
    console.error('❌ Error al crear usuario invitado:', error);
  } finally {
    await pool.end();
  }
}

crearUsuarioInvitado();
