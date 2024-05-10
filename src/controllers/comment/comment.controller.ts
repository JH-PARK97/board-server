import { Request, Response } from 'express';
import { prisma } from '../../server';

const getComment = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const id = Number(postId);
        const getComment = await prisma.comment.findMany({
            where: { postId: id },
            include: { user: { select: { nickname: true, id: true, profileImagePath: true } } },
        });
        res.status(200).json({ data: getComment, resultCd: 200 });
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};
const createComment = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        const { id: postId } = req.params;
        const query = req.query;
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
    getComment,
};
