import AuthService from '../services/auth.service.js';

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Credenciales incompletas' });
    }
    const valid = await AuthService.validateCredentials(username, password);
    if (!valid) return res.status(401).json({ error: 'Autenticación fallida' });
    const token = AuthService.generateToken({ username });
    res.json({ token: `Bearer ${token}` });
  } catch (e) {
    next(e);
  }
}
