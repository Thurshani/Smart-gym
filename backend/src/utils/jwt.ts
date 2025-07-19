import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, role: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(
    { userId, role },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

export const verifyToken = (token: string): { userId: string; role: string } => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.verify(token, jwtSecret) as { userId: string; role: string };
}; 