import { Request, Response } from 'express';
import { prisma } from '../../server';

// const createBlogPost = async (req: Request, res: Response) => {
//     try {
//         const { title, content, category } = req.body;
//         const user = (req as any).user;

//         if (!user) {
//             return res.status(400).json({ error: '존재하지 않는 유저입니다.', resultCd: 400 });
//         }

//         // 해당 category가 이미 존재하는 경우
//         if (category) {
//             const existingCategory = await prisma.category.findUnique({
//                 where: {
//                     name: category,
//                 },
//             });
//             console.log(existingCategory);
//             // 존재하지 않는 카테고리인 경우 새로 생성 카테고리를 생성하고 게시글 등록
//             if (!existingCategory) {
//                 const createCategory = await prisma.category.create({
//                     data: {
//                         name: category,
//                         User: {
//                             connect: {
//                                 id: user.id,
//                             },
//                         },
//                     },
//                 });

//                 const createPost = await prisma.post.create({
//                     data: {
//                         user: {
//                             connect: {
//                                 id: user.id,
//                             },
//                         },
//                         category: {
//                             connect: {
//                                 id: createCategory.id,
//                             },
//                         },
//                         title,
//                         content,
//                     },
//                 });

//                 res.status(200).json({ data: createPost, resultCd: 200 });
//             } else {
//                 const createPost = await prisma.post.create({
//                     data: {
//                         user: {
//                             connect: {
//                                 id: user.id,
//                             },
//                         },
//                         category: {
//                             connect: {
//                                 id: existingCategory.id,
//                             },
//                         },
//                         title,
//                         content,
//                     },
//                 });
//                 res.status(200).json({ data: createPost, resultCd: 200 });
//             }
//         }
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ error: 'Internal server error', resultCd: 500 });
//     }
// };

const createBlogPost = async (req: Request, res: Response) => {
    try {
        const { title, content, category } = req.body;
        const user = (req as any).user;

        if (!user) {
            return res.status(400).json({ error: '존재하지 않는 유저입니다.', resultCd: 400 });
        }

        const categoryData = await getCategoryData(category, user.id);
        if (!categoryData) return null;
        
        const createPost = await createNewPost(user.id, categoryData.id, title, content);

        res.status(200).json({ data: createPost, resultCd: 200 });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error', resultCd: 500 });
    }
};

const getCategoryData = async (category: string, userId: number) => {
    if (!category) return null;

    const existingCategory = await prisma.category.findUnique({
        where: { name: category },
    });

    // 해당 category가 존재하는 경우 바로 카테고리 값 리턴
    if (existingCategory) {
        return existingCategory;
    }

    // 해당 카테고리가 없는 경우 받아온 category 이름으로 카테고리 생성 후 return
    return await prisma.category.create({
        data: {
            name: category,
            User: {
                connect: { id: userId },
            },
        },
    });
};

const createNewPost = async (userId: number, categoryId: number, title: string, content: string) => {
    return await prisma.post.create({
        data: {
            user: {
                connect: { id: userId },
            },
            category: {
                connect: { id: categoryId },
            },
            title,
            content,
        },
    });
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
        const _postList = await prisma.post.findMany({
            include: {
                user: {
                    select: {
                        nickname: true,
                        profileImagePath: true,
                    },
                },
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
                    select: { comments: true },
                },
            },
        });

        const postList = _postList.map((post) => {
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
                user: post.user,
                totalCommentCount,
            };
        });

        res.status(200).json({ data: postList, resultCd: 200 });
    } catch (e) {
        console.log(e);
        res.status(500).json({ resultCd: 500, message: 'Internal Server Error' });
    }
};

const getBlogPostDetailById = async (req: Request, res: Response) => {
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
    getBlogPostDetailById,
    updateBlogPost,
    deleteBlogPostById,
};
