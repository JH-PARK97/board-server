import { Request, Response } from 'express';
import { prisma } from '../../server';

const getUser = async (req: Request, res: Response) => {
    try {
        const { userId: _userId } = req.query;
        const userId = Number(_userId);
        let getUser;
        if (userId) {
            getUser = await prisma.user.findUnique({
                where: { id: userId },
            });
        } else {
            getUser = await prisma.user.findMany();
        }

        if (!getUser) {
            return res.status(404).json({ resultCd: 404, message: '유저 정보가 없습니다.' });
        }

        res.status(200).json({ resultCd: 200, data: getUser });
    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
};

const getUserPostById = async (req: Request, res: Response) => {
    try {
        const { userId: _userId } = req.params;
        const { pageNo: _pageNo, pageSize: _pageSize } = req.query;
        const userId = Number(_userId);
        const pageSize = Number(_pageSize) || 7;
        const pageNo = (Number(_pageNo) - 1) * pageSize || 0;

        const _getUserPost = await prisma.user.findUnique({
            where: { id: userId },

            select: {
                id: true,
                email: true,
                categories: true,
                nickname: true,
                profileImagePath: true,
                _count: {
                    select: {
                        posts: true,
                    },
                },
                posts: {
                    skip: pageNo,
                    take: pageSize,
                    include: {
                        categories: true,

                        tag: true,
                        comments: {
                            select: {
                                _count: {
                                    select: {
                                        replies: true,
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
            const totalReplies = post.comments.reduce((acc, comment) => acc + comment._count.replies, 0);
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
                categoryId: post.categories,
                tag: post.tag,
            };
        });

        const getUserPosts = {
            id: _getUserPost.id,
            email: _getUserPost.email,
            nickname: _getUserPost.nickname,
            profileImagePath: _getUserPost.profileImagePath,
            posts: formattedPosts,
            totalCount: _getUserPost._count.posts,
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
