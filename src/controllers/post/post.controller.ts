import { Request, Response } from 'express';
import { prisma } from '../../server';

const createBlogPost = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;

        const user = (req as any).user;

        if (!user) return res.status(400).json({ error: '존재하지 않는 유저입니다.', resultCd: 400 });

        const createPost = await prisma.post.create({
            data: {
                title,
                content,
                user: {
                    connect: { id: user.id },
                },
            },
        });
        res.status(200).json({ data: createPost, resultCd: 200 });
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};

const updateBlogPost = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        const user = (req as any).user;
        const updatePost = await prisma.post.update({
            where: { id: Number(req.params.id) },
            data: {
                title,
                content,
                user: {
                    connect: { id: user.id },
                },
            },
        });
        res.status(200).json({ data: updatePost, resultCd: 200 });
    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
};

const getPostList = async (req: Request, res: Response) => {
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

        if (postById) {
            res.status(200).json({ data: postById, resultCd: 200 });
        } else {
            res.status(200).json({ resultMsg: '삭제된 게시글 입니다.', resultCd: 404 });
        }
    } catch (e) {
        console.log(e);
        res.status(500);
    }
};

const deleteBlogPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const postId = Number(id);
        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            res.status(200).json({ resultMsg: '이미 삭제된 게시글 입니다.', resultCd: 404 });
        }

        const isWriter = post?.userId === (req as any).user.id;
        if (isWriter) {
            const deletePost = await prisma.post.delete({
                where: { id: postId },
            });
            res.status(200).json({ data: deletePost, resultCd: 200 });
        } else {
            res.status(200).json({ resultMsg: '본인이 작성한 게시글만 삭제할 수 있습니다.', resultCd: 403 });
        }
    } catch (e) {
        console.log(e);
        res.status(500);
    }
};

export default {
    createBlogPost,
    getPostList,
    getBlogPostById,
    updateBlogPost,
    deleteBlogPostById,
};
