import { Request, Response } from 'express';
import { prisma } from '../../server';
const getCategories = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { category } = req.query;

        const getCategetCategoriesByuserId = await prisma.category.findMany({
            where: {
                userId: Number(userId),
            },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });

        if (!getCategetCategoriesByuserId) {
            return res.status(400).json({ resultMsg: '잘못된 유저정보입니다.', resultCd: 200 });
        }

        const formattedCategories = getCategetCategoriesByuserId.map((category) => {
            const { _count, ...restCategory } = category;
            return {
                ...restCategory,
                totalCount: _count.posts,
            };
        });

        res.status(200).json({ data: formattedCategories, resultCd: 200 });
    } catch (e) {
        console.log(e);
    }
};
export default { getCategories };
