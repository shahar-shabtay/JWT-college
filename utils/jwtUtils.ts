import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '15m';

export function generateAccessToken(_id: string): string {
    if (typeof _id !== 'string') {
        throw new Error('Invalid user ID provided for token generation');
    }
    return jwt.sign({ _id }, ACCESS_TOKEN_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function generateRefreshToken(_id: string): string {
    if (typeof _id !== 'string') {
        throw new Error('Invalid user ID provided for refresh token generation');
    }
    return jwt.sign({ _id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export function verifyRefreshToken(token: string): string | null {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
        return decoded._id;
    } catch (error) {
        console.error('Error verifying refresh token:', error.message);
        return null;
    }
}
