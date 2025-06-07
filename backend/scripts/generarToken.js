const jwt = require('jsonwebtoken');

// Clave secreta que usas en tu backend (¡debe coincidir!)
const SECRET_KEY = 'Colombia2025';

// Información del usuario para el token (ajústala si usas otros campos)
const payload = {
  username: 'estebanquilindo', // puede ser otro username registrado
  perfil: 'Administrador'      // debe coincidir con los roles válidos en tu sistema
};

// Generar token válido por 100 años (solo para pruebas)
const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '100y' });

console.log('🔐 Token JWT generado exitosamente:\n');
console.log(token);
