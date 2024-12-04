import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

export function generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export function verifyRefreshToken(token: string): string | null {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
        return decoded.userId;
    } catch (error) {
        return null;
    }
}
