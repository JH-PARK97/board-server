import { Request, Response } from 'express';
import { prisma } from '../../server';

const createUser = async (req: Request, res: Response) => {
    try {
        const { email, name, phoneNumber, age, gender } = req.body;
        const createUser = await prisma.user.create({
            data: {
                email,
                name,
                phoneNumber,
                age,
                gender,
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
