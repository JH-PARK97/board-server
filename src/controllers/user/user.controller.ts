import { Request, Response } from 'express';
import { prisma } from '../../server';

const getUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const getUser = await prisma.user.findMany({
            where: email,
        });
        res.status(200).json(getUser);
    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
};

export default {
    getUser,
};
