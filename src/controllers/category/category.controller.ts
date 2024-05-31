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

const deleteCategories = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;
        const user = (req as any).user;
        const existingCategory = await prisma.category.findUnique({
            where: { id: Number(categoryId) },
        });
        if (!existingCategory) {
            return res.status(400).json({ resultMsg: '존재하지 않는 카테고리입니다.', resultCd: 400 });
        }
        const deleteCategory = await prisma.category.delete({
            where: { id: Number(categoryId) },
        });

        res.status(200).json({ data: deleteCategory, resultCd: 200 });
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
};
export default { getCategories, deleteCategories };
