import { Request, Response } from 'express';
import { prisma } from '../../server';

const getCategories = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { category, id } = req.query;

        const getCategoriesByUserId = await prisma.category.findMany({
            where: {
                ...(category ? { userId: Number(userId), id: Number(category) } : { userId: Number(userId) }),
            },
            include: {
                tags: {
                    include: {
                        _count: {
                            select: {
                                posts: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });

        if (!getCategoriesByUserId) {
            return res.status(400).json({ resultMsg: '잘못된 유저정보입니다.', resultCd: 200 });
        }
        const formattedCategories = getCategoriesByUserId.map((category) => {
            console.log(category);
            return {
                ...category,
                tags: category.tags.map((tag) => ({
                    ...tag,
                    count: tag._count.posts,
                    _count: undefined, // _count 필드 제거
                })),
                _count: undefined,
                totalCount: category._count.posts,
            };
        });

        console.log('formattedCategories : ', formattedCategories);
        res.status(200).json({ data: formattedCategories, resultCd: 200 });
    } catch (e) {
        console.log(e);
    }
};

export default { getCategories };
