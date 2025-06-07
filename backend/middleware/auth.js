const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'Colombia2025';

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido', details: err.message });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error en authenticateToken:', error);
    res.status(500).json({ error: 'Error interno en autenticación' });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const userRole = req.user.perfil?.toLowerCase();
      const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

      if (!userRole || !normalizedAllowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          error: 'No tienes permiso para realizar esta acción',
          userRole,
          allowedRoles
        });
      }

      next();
    } catch (error) {
      console.error('Error en authorizeRoles:', error);
      res.status(500).json({ error: 'Error interno en autorización' });
    }
  };
}

module.exports = { authenticateToken, authorizeRoles };
