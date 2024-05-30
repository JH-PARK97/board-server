import { Request, Response } from 'express';
import { prisma } from '../../server';
const getCategories = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { category } = req.query;

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
            const formattedTags = category.tags.map((tag) => {
                const { _count, ...rest } = tag;
                return {
                    ...rest,
                    count: _count.posts,
                };
            });

            const { _count, ...restCategory } = category;
            return {
                ...restCategory,
                tags: formattedTags,
                totalCount: _count.posts,
            };
        });

        res.status(200).json({ data: formattedCategories, resultCd: 200 });
    } catch (e) {
        console.log(e);
    }
};
export default { getCategories };
