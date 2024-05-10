import express from 'express';
import postController from '../controllers/post/post.controller';
import authController from '../controllers/auth/auth.controller';
import fileController from '../controllers/file/file.controller';
import commentController from '../controllers/comment/comment.controller';

import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// 게시글
router.get('/post', postController.getPostList);
router.post('/post', authMiddleware, postController.createBlogPost);

router.get('/post/:id', postController.getBlogPostById);
router.put('/post/:id', authMiddleware, postController.updateBlogPost);
router.delete('/post/:id', authMiddleware, postController.deleteBlogPostById);

// 댓글
router.post('/comment/:id', authMiddleware, commentController.createComment);
router.get('/comment/:id', commentController.getComment);

// auth (로그인, 로그아웃, 회원가입)
router.post('/user', authController.createUser);
router.post('/login', authController.login);
// router.post('logout',authController.logout)

// file (업로드, 이미지 불러오기)
router.post('/upload', fileController.upload);
// router.get('/images', fileController.getImage);
router.get('/images/:filename', fileController.getImage);

export default router;
