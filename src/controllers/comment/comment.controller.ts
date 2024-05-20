import { Request, Response } from 'express';
import { prisma } from '../../server';

const getComment = async (req: Request, res: Response) => {
    try {
        const { postId: _postId } = req.params;
        const postId = Number(_postId);

        const getComment = await prisma.comment.findMany({
            where: { postId },

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

        const { postId: _postId } = req.params;
        const postId = Number(_postId);

        const { id: userId } = (req as any).user;

        const createComment = await prisma.comment.create({
            data: {
                content,
                userId,
                postId: postId,
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

        const { commentId: _commentId } = req.params;
        const commentId = Number(_commentId);

        const { id: userId } = (req as any).user;

        const comment = await getCommentById(commentId);
        if (!comment) return res.status(400).json({ resultMsg: '잘못된 사용자 정보입니다.', resultCd: 200 });

        const isWriter = comment.userId === userId;

        if (isWriter) {
            const updateComment = await prisma.comment.update({
                where: { id: commentId },
                data: {
                    content,
                    user: {
                        connect: { id: userId },
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
        const { commentId: _commentId } = req.params;
        const commentId = Number(_commentId);

        const comment = await getCommentById(commentId);
        const { id: userId } = (req as any).user;

        if (!comment) return res.status(400).json({ resultMsg: '댓글이 존재하지 않습니다.', resultCd: 200 });
        const isWriter = comment.userId === userId;
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

const getReply = async (req: Request, res: Response) => {
    try {
        const { parentCommentId: _parentCommentId } = req.params;
        const parentCommentId = Number(_parentCommentId);
        const getReply = await prisma.reply.findMany({
            where: { commentId: parentCommentId },

            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({ data: getReply, resultCd: 200 });
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};

const createReply = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;

        const { parentCommentId: _parentCommentId } = req.params;
        const parentCommentId = Number(_parentCommentId);

        const { id: userId } = (req as any).user;
        const createReply = await prisma.reply.create({
            data: {
                content,
                userId,
                commentId: parentCommentId,
            },
        });
        res.status(200).json({ data: createReply, resultCd: 200 });
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};

const updateReply = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;

        const { parentCommentId: _parentCommentId, replyId: _replyId } = req.params;
        const parentCommentId = Number(_parentCommentId);
        const replyId = Number(_replyId);

        const { id: userId } = (req as any).user;

        const reply = await getReplyById(parentCommentId, replyId);
        if (!reply) return res.status(400).json({ resultMsg: '답글이 존재하지 않습니다.', resultCd: 200 });
        const isWriter = reply.userId === userId;

        if (isWriter) {
            const updateReply = await prisma.reply.update({
                data: { content },
                where: { id: replyId },
            });
            res.status(200).json({ data: updateReply, resultCd: 200 });
        } else {
            res.status(200).json({ resultMsg: '잘못된 사용자 정보입니다.', resultCd: 401 });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};

const deleteReply = async (req: Request, res: Response) => {
    try {
        const { parentCommentId: _parentCommentId, replyId: _replyId } = req.params;

        const parentCommentId = Number(_parentCommentId);
        const replyId = Number(_replyId);

        const { id: userId } = (req as any).user;

        const reply = await getReplyById(parentCommentId, replyId);

        if (!reply) return res.status(400).json({ resultMsg: '답글이 존재하지 않습니다.', resultCd: 200 });
        const isWriter = reply.userId === userId;

        if (isWriter) {
            const deleteReply = await prisma.reply.delete({
                where: { id: replyId },
            });
            res.status(200).json({ data: deleteReply, resultCd: 200 });
        } else {
            res.status(200).json({ resultMsg: '잘못된 사용자 정보입니다.', resultCd: 401 });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};

const getCommentById = async (commentId: number) => {
    return await prisma.comment.findUnique({
        where: { id: commentId },
    });
};

const getReplyById = async (parentCommentId: number, replyId: number) => {
    return await prisma.reply.findUnique({
        where: {
            commentId: parentCommentId,
            id: replyId,
        },
    });
};

export default {
    getComment,
    createComment,
    updateComment,
    deleteComment,
    getReply,
    createReply,
    updateReply,
    deleteReply,
};
