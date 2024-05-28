import express from 'express';

import postController from '../controllers/post/post.controller';
import authController from '../controllers/auth/auth.controller';
import fileController from '../controllers/file/file.controller';
import commentController from '../controllers/comment/comment.controller';
import userController from '../controllers/user/user.controller';
import categoryController from '../controllers/category/category.controller';

import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// 게시글
router.get('/post', postController.getPostList);
router.post('/post', authMiddleware, postController.createBlogPost);

router.get('/post/:id', postController.getBlogPostDetailById);
router.put('/post/:id', authMiddleware, postController.updateBlogPost);
router.delete('/post/:id', authMiddleware, postController.deleteBlogPostById);

// 댓글
router.get('/comment/:postId', commentController.getComment);
router.post('/comment/:postId', authMiddleware, commentController.createComment);
router.put('/comment/:commentId', authMiddleware, commentController.updateComment);
router.delete('/comment/:commentId', authMiddleware, commentController.deleteComment);

// 답글
router.get('/reply/:parentCommentId', authMiddleware, commentController.getReply);
router.post('/reply/:parentCommentId', authMiddleware, commentController.createReply);
router.put('/reply/parentId/:parentCommentId/replyId/:replyId', authMiddleware, commentController.updateReply);
router.delete('/reply/parentId/:parentCommentId/replyId/:replyId', authMiddleware, commentController.deleteReply);

// auth (로그인, 로그아웃, 회원가입)
router.post('/user', authController.createUser);
router.post('/login', authController.login);
// router.post('logout',authController.logout)

// file (업로드, 이미지 불러오기)
router.post('/upload', fileController.upload);
// router.get('/images', fileController.getImage);
router.get('/images/:filename', fileController.getImage);

// 유저정보
router.get('/user', userController.getUser);
router.get('/user/:userId', userController.getUserPostById);

// 카테고리(해당 유저 게시글의 카테고리)
router.get('/category/:userId', categoryController.getCategories);

export default router;
