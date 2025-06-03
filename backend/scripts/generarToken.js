const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'Colombia2025';

const payload = {
  username: 'admin',
  perfil: 'administrador',
};

const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '100y' }); // Token válido por 100 años

console.log('Token JWT válido permanente para pruebas:');
console.log(token);
