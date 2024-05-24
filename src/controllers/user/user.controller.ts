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
        const _getUserPost = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                nickname: true,
                profileImagePath: true,

                posts: {
                    include: {
                        comments: {
                            select: {
                                _count: {
                                    select: {
                                        reply: true,
                                    },
                                },
                            },
                        },
                        _count: {
                            select: {
                                comments: true,
                            },
                        },
                    },
                },
            },
        });

        if (!_getUserPost) return null;

        const formattedPosts = _getUserPost.posts.map((post) => {
            const totalReplies = post.comments.reduce((acc, comment) => acc + comment._count.reply, 0);
            const totalCommentCount = post._count.comments + totalReplies;

            return {
                id: post.id,
                title: post.title,
                content: post.content,
                likeCount: post.likeCount,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                userId: post.userId,
                totalCommentCount,
            };
        });

        const getUserPosts = {
            id: _getUserPost.id,
            email: _getUserPost.email,
            nickname: _getUserPost.nickname,
            profileImagePath: _getUserPost.profileImagePath,
            posts: formattedPosts,
        };

        res.status(200).json({ resultCd: 200, data: getUserPosts });
    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
};

export default {
    getUser,
    getUserPostById,
};
