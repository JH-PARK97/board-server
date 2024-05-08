import { Request, Response } from 'express';
import { prisma } from '../../server';

const createBlogPost = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;

        const user = (req as any).user;

        if (!user) return res.status(401).json({ error: '존재하지 않는 유저입니다.' });

        const newBlogPost = await prisma.post.create({
            data: {
                title,
                content,
                user: {
                    connect: { id: user.id },
                },
            },
        });
        res.status(200).json({ data: newBlogPost, resultCd: 200 });
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};

const updateBlogPost = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        const user = (req as any).user;
        console.log(res);
        const updateBlogPost = await prisma.post.update({
            where: { id: Number(req.params.id) },
            data: {
                title,
                content,
                user: {
                    connect: { id: user.id },
                },
            },
        });
        res.status(200).json({ data: updateBlogPost, resultCd: 200 });
    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
};

const getBlogPost = async (req: Request, res: Response) => {
    try {
        const postList = await prisma.post.findMany({
            include: {
                user: {
                    select: {
                        nickname: true,
                        profileImagePath: true,
                    },
                },
            },
        });
        res.status(200).json({ data: postList, resultCd: 200 });
    } catch (e) {
        console.log(e);
        res.status(500);
    }
};

const getBlogPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const postId = Number(id);

        const postById = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                user: {
                    select: {
                        nickname: true,
                        profileImagePath: true,
                    },
                },
            },
        });
        res.status(200).json({ data: postById, resultCd: 200 });
    } catch (e) {
        console.log(e);
        res.status(500);
    }
};

export default {
    createBlogPost,
    getBlogPost,
    getBlogPostById,
    updateBlogPost,
};
