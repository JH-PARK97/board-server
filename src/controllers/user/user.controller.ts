import { Request, Response } from 'express';
import { prisma } from '../../server';

const createUser = async (req: Request, res: Response) => {
    try {
        const { email, phoneNumber, age, gender, password } = req.body;
        const isDuplicateEmail = await prisma.user.findUnique({ where: { email } });
        if (isDuplicateEmail) {
            {
                return res.status(400).json({ resultMsg: '이미 존재하는 이메일입니다.', resultCode: 2002 });
            }
        }
        const createUser = await prisma.user.create({
            data: {
                email,
                phoneNumber,
                age,
                gender,
                password,
            },
        });
        res.status(200).json(createUser);
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
