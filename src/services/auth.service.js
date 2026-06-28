import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_demo';
const AUTH_USER = process.env.AUTH_USER || 'admin';
const AUTH_PASS = process.env.AUTH_PASS || 'admin123';

export default class AuthService {
  static async validateCredentials(username, password) {
    // En un sistema real, validar contra DB y usar hashing
    return username === AUTH_USER && password === AUTH_PASS;
  }

  static generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
  }

  static verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }
}
