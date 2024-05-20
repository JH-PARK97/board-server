import { Request, Response } from 'express';
import { prisma } from '../../server';

const getComment = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const id = Number(postId);
        const getComment = await prisma.comment.findMany({
            where: { postId: id },

            include: {
                user: { select: { nickname: true, id: true, profileImagePath: true } },
                reply: { include: { user: { select: { nickname: true, id: true, profileImagePath: true } } } },
            },

            orderBy: {
                createdAt: 'desc',
            },
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
        const { postId } = req.params;
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

const updateComment = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        const { commentId } = req.params;
        const user = (req as any).user;

        const getComment = await prisma.comment.findUnique({
            where: { id: Number(commentId) },
        });
        if (!getComment) return res.status(400).json({ resultMsg: '잘못된 사용자 정보입니다.', resultCd: 200 });

        const isWriter = getComment.userId === user.id;

        if (isWriter) {
            const updateComment = await prisma.comment.update({
                where: { id: Number(commentId) },
                data: {
                    content,
                    user: {
                        connect: { id: user.id },
                    },
                },
            });
            res.status(200).json({ data: updateComment, resultCd: 200 });
        } else {
            res.status(200).json({ resultMsg: '잘못된 사용자 정보입니다.', resultCd: 401 });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};

const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId: id } = req.params;
        const commentId = Number(id);
        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        const user = (req as any).user;

        if (!comment) return res.status(400).json({ resultMsg: '댓글이 존재하지 않습니다.', resultCd: 200 });
        const isWriter = comment.userId === user.id;
        console.log(isWriter);
        if (isWriter) {
            const deleteComment = await prisma.comment.delete({
                where: { id: commentId },
            });
            res.status(200).json({ data: deleteComment, resultCd: 200 });
        } else {
            res.status(200).json({ resultMsg: '잘못된 사용자 정보입니다.', resultCd: 401 });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};
const createReply = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        const { id: commentId } = req.params;
        const { id: userId } = (req as any).user;
        console.log(commentId, userId);
        const createReply = await prisma.reply.create({
            data: {
                content,
                userId,
                commentId: Number(commentId),
            },
        });
        res.status(200).json({ data: createReply, resultCd: 200 });
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};

export default {
    createComment,
    updateComment,
    getComment,
    createReply,
    deleteComment,
};
