import { Request, Response } from 'express';
import { prisma } from '../../server';

const getCategories = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const getCategoriesByUserId = await prisma.category.findMany({
            where: { userId: Number(userId) },
            include: {
                tags: true,
            },
        });
        console.log(getCategoriesByUserId);

        if (!getCategoriesByUserId) {
            return res.status(400).json({ resultMsg: '잘못된 유저정보입니다.', resultCd: 200 });
        }
        res.status(200).json({ data: getCategoriesByUserId, resultCd: 200 });
    } catch (e) {
        console.log(e);
    }
};

export default { getCategories };
