import { NextFunction, Request, Response } from 'express';
import jwt, { Jwt, JwtHeader } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../constants';
import { prisma } from '../server';
import { User } from '@prisma/client';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.split(' ');
    if (!bearerToken) return;
    const token = bearerToken[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET_KEY);
        const { id } = decoded;

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new Error('존재하지 않는 사용자 입니다.');
        }
        (req as any).user = exclude(user, ['password']);

        next();
    } catch (error) {
        console.error('jwt 검증 오류', error);
        res.status(401).json({ error: 'Invalid token' });
    }
}

export function decodeJWT(token: string) {
    if (typeof token === 'string') {
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY) as any;
        if (!decodedToken) return null;

        const { id } = decodedToken;
        return id;
    }
    return token;
}

function exclude<Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> {
    return Object.fromEntries(Object.entries(user).filter(([key]) => !keys.includes(key as unknown as Key))) as Omit<
        User,
        Key
    >;
}
