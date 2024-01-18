import express from 'express';
import postController from '../controllers/post/post.controller';
import authController from '../controllers/auth/auth.controller';

const router = express.Router();

// 게시글
router.post('/post', postController.createBlogPost);

// auth (로그인, 로그아웃, 회원가입)
router.post('/user', authController.createUser);
router.post('/login', authController.login);
// router.post('logout',authController.logout)

export default router;
