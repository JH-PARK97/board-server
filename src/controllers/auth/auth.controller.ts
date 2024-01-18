import { Request, Response } from 'express';
import { prisma } from '../../server';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

const createUser = async (req: Request, res: Response) => {
    const SALT_ROUND = 10;
    try {
        const { email, phoneNumber, age, gender, password } = req.body;
        const hashPw = await bcrypt.hash(password, SALT_ROUND);
        const isDuplicateEmail = await prisma.user.findUnique({ where: { email } });
        if (isDuplicateEmail) {
            {
                return res.status(409).json({ error: { resultMsg: '이미 존재하는 이메일입니다.', resultCode: 2002 } });
            }
        }
        const createUser = await prisma.user.create({
            data: {
                email,
                phoneNumber,
                age,
                gender,
                password: hashPw,
            },
        });
        res.status(201).json(createUser);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
                console.log('There is a unique constraint violation, a new user cannot be created with this email');
            }
        }
        throw e;
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: { resultMsg: '존재하지 않는 계정입니다', resultCd: '2004' } });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                error: {
                    resultMsg: '비밀번호가 틀렸습니다.',
                    resultCd: '2003',
                },
            });
        }
        return res.status(200).json({ user, resultCd: '2000' });
    } catch (e) {
        console.error('error', e);
    }
};

// const getUser = async (req: Request, res: Response) => {
//     try {
//         const { email } = req.body;
//         const getUser = await prisma.user.findMany({
//             email,
//         });
//         res.status(200).json(getUser);
//     } catch (e) {
//         res.status(500).json({ error: e });
//     }
// };

export default {
    createUser,
    login,
};
