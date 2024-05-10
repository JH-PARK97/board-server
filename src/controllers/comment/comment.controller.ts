import { Request, Response } from 'express';
import { prisma } from '../../server';

const createComment = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        const { id: postId } = req.params;
        const { id: userId } = (req as any).user;
        const createComment = await prisma.comment.create({
            data: {
                content,
                userId,
                postId: Number(postId),
            },
        });
        res.status(200).json({ data: createComment, resultCd: 200 });
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};

export default {
    createComment,
};
