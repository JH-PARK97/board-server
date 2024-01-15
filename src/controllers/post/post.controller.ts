import { Request, Response } from 'express';
import { prisma } from '../../server';

const createBlogPost = async (req: Request, res: Response) => {
    try {
        const { userId, title, content } = req.body;
        const newBlogPost = await prisma.post.create({
            data: {
                title,
                content,
                userId,
            },
        });
        res.status(200).json(newBlogPost);
    } catch (e) {
        res.status(500).json({ error: e });
    }
};

export default {
    createBlogPost,
};
