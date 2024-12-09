import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '15m';

export function generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export function verifyRefreshToken(token: string): string | null {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
        return decoded.userId;
    } catch (error) {
        return error;
    }
}
