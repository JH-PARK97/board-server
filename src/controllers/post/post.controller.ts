import { Request, Response } from 'express';
import { prisma } from '../../server';

const createBlogPost = async (req: Request, res: Response) => {
    try {
        const { email, title, content } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: '존재하지 않는 유저입니다.' });

        const newBlogPost = await prisma.post.create({
            data: {
                title,
                content,
                userId: user?.id,
            },
        });
        res.status(200).json({ data: newBlogPost, resultCd: 200 });
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};

export default {
    createBlogPost,
};
