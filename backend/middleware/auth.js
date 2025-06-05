const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'Colombia2025';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Middleware auth - Authorization header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  console.log('Middleware auth - Token extraído:', token);

  if (!token) {
    console.log('Middleware auth - Token no proporcionado');
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Middleware auth - Token inválido:', err.message);
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    console.log('Middleware auth - Token válido, usuario:', user);
    next();
  });
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    // Permitir cualquier rol para pruebas
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
