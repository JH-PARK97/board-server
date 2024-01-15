import { Request, Response } from 'express';
import { prisma } from '../../server';
import bcrypt from 'bcrypt';

const createUser = async (req: Request, res: Response) => {
    const SALT_ROUND = 10;
    try {
        const { email, phoneNumber, age, gender, password } = req.body;
        const hashPw = await bcrypt.hash(password, SALT_ROUND);
        const isDuplicateEmail = await prisma.user.findUnique({ where: { email } });
        if (isDuplicateEmail) {
            {
                return res.status(409).json({ resultMsg: '이미 존재하는 이메일입니다.', resultCode: 2002 });
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
        res.status(500).json({ error: e });
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
    // getUser,
};
