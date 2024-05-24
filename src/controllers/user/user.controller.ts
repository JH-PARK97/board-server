import { Request, Response } from 'express';
import { prisma } from '../../server';

const getUser = async (req: Request, res: Response) => {
    try {
        const getUser = await prisma.user.findMany();
        res.status(200).json({ resultCd: 200, data: getUser });
    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
};

const getUserPostById = async (req: Request, res: Response) => {
    try {
        const { userId: _userId } = req.params;
        const userId = Number(_userId);
        const getUserPost = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                nickname: true,
                posts: {
                    include: {
                        _count: {
                            select: {
                                comments: true,
                            },
                        },
                    },
                },
            },
        });

        res.status(200).json({ resultCd: 200, data: getUserPost });
    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
};

export default {
    getUser,
    getUserPostById,
};
