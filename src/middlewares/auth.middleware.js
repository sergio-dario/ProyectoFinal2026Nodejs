import AuthService from '../services/auth.service.js';

export async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Token no proporcionado' });
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Formato de token inválido' });
    const token = parts[1];
    try {
      const payload = AuthService.verifyToken(token);
      req.user = payload;
      next();
    } catch (e) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
  } catch (e) {
    next(e);
  }
}
