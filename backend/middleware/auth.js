const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'Colombia2025';

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    console.log('Middleware auth - Authorization header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log('Middleware auth - Token extraído:', token);

    if (!token) {
      console.log('Middleware auth - Token no proporcionado');
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log('Middleware auth - Token inválido:', err.message);
        return res.status(403).json({ error: 'Token inválido', details: err.message });
      }
      
      console.log('Middleware auth - Token decodificado:', decoded);
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
        console.log('Middleware authorizeRoles - Usuario no autenticado');
        return res.status(401).json({ error: 'No autenticado' });
      }

      const userRole = req.user.perfil ? req.user.perfil.toLowerCase() : null;
      console.log('Middleware authorizeRoles - Rol del usuario:', userRole);
      console.log('Middleware authorizeRoles - Roles permitidos:', allowedRoles);

      if (!userRole || !allowedRoles.includes(userRole)) {
        console.log('Middleware authorizeRoles - Acceso denegado');
        return res.status(403).json({ 
          error: 'No tienes permiso para realizar esta acción',
          userRole: userRole,
          allowedRoles: allowedRoles
        });
      }

      console.log('Middleware authorizeRoles - Acceso permitido para rol:', userRole);
      next();
    } catch (error) {
      console.error('Error en authorizeRoles:', error);
      res.status(500).json({ error: 'Error interno en autorización' });
    }
  };
}

module.exports = { authenticateToken, authorizeRoles };
