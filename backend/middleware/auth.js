const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'Colombia2025';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    // Cambiar 'admin' por 'administrador' para coincidir con el frontend
    const userRole = req.user.perfil.toLowerCase();
    const allowedRoles = roles.map(role => role.toLowerCase());
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'No autorizado para esta acción' });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
