const db = require('../config/db');

async function crearPerfilesBase() {
  const perfiles = [
    { nombre: 'administrador', estado: true },
    { nombre: 'usuario', estado: true },
    { nombre: 'invitado', estado: true }
  ];

  try {
    // Verificar si ya existen perfiles
    const [perfilesExistentes] = await db.execute('SELECT nombre FROM perfil');
    const perfilesActuales = perfilesExistentes.map(p => p.nombre);

    for (const perfil of perfiles) {
      if (!perfilesActuales.includes(perfil.nombre)) {
        // Crear perfil si no existe
        await db.execute(
          'INSERT INTO perfil (nombre, estado) VALUES (?, ?)',
          [perfil.nombre, perfil.estado]
        );
        console.log(`✅ Perfil "${perfil.nombre}" creado exitosamente`);
      } else {
        console.log(`ℹ️ El perfil "${perfil.nombre}" ya existe`);
      }
    }

    console.log('✅ Proceso completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear perfiles base:', error);
    process.exit(1);
  }
}

crearPerfilesBase();
