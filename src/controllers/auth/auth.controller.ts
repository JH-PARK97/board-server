import { Request, Response } from 'express';
import { prisma } from '../../server';
import bcrypt from 'bcrypt';
import { Prisma, type User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { profileMiddleware } from '../../middleware/uploadMiddleware';

const createUser = async (req: Request, res: Response) => {
    const SALT_ROUND = 10;
    try {
        await profileMiddleware(req, res);

        const { signUp } = req.body;
        const signUpData = JSON.parse(signUp);
        const { email, password, gender, phoneNumber, age, nickname, profile } = signUpData;
        const profileImagePath = req.file ? req.file?.path : profile;
        const hashPw = await bcrypt.hash(password, SALT_ROUND);
        const isDuplicateEmail = await prisma.user.findUnique({ where: { email } });
        if (isDuplicateEmail) {
            {
                return res.status(409).json({ error: { resultCd: 409, resultMsg: '이미 존재하는 이메일입니다.' } });
            }
        }
        const createUser = await prisma.user.create({
            data: {
                email,
                phoneNumber,
                age,
                gender,
                password: hashPw,
                profileImagePath,
                nickname,
            },
        });
        return res.status(201).json({ resultCd: 200, data: createUser });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                console.log('There is a unique constraint violation, a new user cannot be created with this email');
            }
        }
        console.log(e);
    }
};

function exclude<Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> {
    return Object.fromEntries(Object.entries(user).filter(([key]) => !keys.includes(key as unknown as Key))) as Omit<
        User,
        Key
    >;
}

const login = async (req: Request, res: Response) => {
    const jwtSecretKey = process.env.TOKEN_SECRET_KEY as string;
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: { resultCd: 401, resultMsg: '존재하지 않는 계정입니다.' } });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                error: {
                    resultCd: 401,
                    resultMsg: '비밀번호가 틀렸습니다.',
                },
            });
        }

        const token = jwt.sign({ email: user.email, age: user.age, gender: user.gender }, jwtSecretKey, {
            expiresIn: '1h',
        });
        // res.cookie('token', token, { httpOnly: true,  });
        res.status(200).json({ resultCd: 200, data: exclude(user, ['password']), token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

export default {
    createUser,
    login,
};
