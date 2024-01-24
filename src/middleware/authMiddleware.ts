import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const jwtSecretKey = process.env.TOKEN_SECRET_KEY as string;

    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

// export function verifyToken async (req:Request, res:Response) {
//     const token = req.headers.authorization;
// }
