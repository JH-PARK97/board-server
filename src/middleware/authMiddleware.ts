import { NextFunction, Request, Response } from 'express';
import jwt, { Jwt, JwtHeader } from 'jsonwebtoken';

const jwtSecretKey = process.env.TOKEN_SECRET_KEY as string;
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.split(' ');
    if (!bearerToken) return;
    const token = bearerToken[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

export function decodeJWT(token: string) {
    if (typeof token === 'string') {
        const decodedToken = jwt.verify(token, jwtSecretKey) as any;
        if (!decodedToken) return null;

        const { id } = decodedToken;
        return id;
    }
    return token;
}
