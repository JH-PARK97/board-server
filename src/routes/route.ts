import express from 'express';
import postController from '../controllers/post/post.controller';
import authController from '../controllers/auth/auth.controller';
import fileController from '../controllers/file/file.controller';

import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// 게시글
router.post('/post', authMiddleware, postController.createBlogPost);

// auth (로그인, 로그아웃, 회원가입)
router.post('/user', authController.createUser);
router.post('/login', authController.login);
// router.post('logout',authController.logout)

// file (업로드, 리스트 불러오기, 다운로드)
router.post('/upload', fileController.upload);
router.get('/files', fileController.getListFiles);
router.get('/files/:name', fileController.download);

export default router;
