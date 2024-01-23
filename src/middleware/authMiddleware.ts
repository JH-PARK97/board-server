import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    email: string;
}

interface CustomRequest extends Request {
    email?: string;
}
export function authMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
    const jwtSecretKey = process.env.TOKEN_SECRET_KEY as string;
    const token = req.header('Authorization');
    console.log(req.header(''));
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, jwtSecretKey) as JwtPayload;
        req.email = decoded.email;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
